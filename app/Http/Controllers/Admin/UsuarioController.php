<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Models\Auditoria;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Gestión de Usuarios y Roles (CU-01)
 * Restringido exclusivamente al rol Director.
 */
class UsuarioController extends Controller
{
    /**
     * Lista paginada y filtrable de usuarios.
     */
    public function index(Request $request): Response
    {
        $query = Usuario::with('rol');

        if ($request->filled('buscar')) {
            $buscar = trim($request->input('buscar'));
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre_completo', 'ilike', "%{$buscar}%")
                  ->orWhere('correo_electronico', 'ilike', "%{$buscar}%");
            });
        }

        if ($request->filled('rol_id')) {
            $query->where('rol_id', $request->input('rol_id'));
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $usuarios = $query->orderBy('id_usuario', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
            'roles'    => Rol::orderBy('id_rol')->get(),
            'filtros'  => $request->only(['buscar', 'rol_id', 'estado']),
        ]);
    }

    /**
     * Formulario de creación de usuario.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Usuarios/Create', [
            'roles' => Rol::orderBy('id_rol')->get(),
        ]);
    }

    /**
     * Almacena un nuevo usuario en feder.usuario y audita la acción.
     */
    public function store(StoreUsuarioRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['hash_contrasena'] = Hash::make($data['contrasena']);
        unset($data['contrasena']);
        $data['fecha_registro'] = now();

        $usuario = Usuario::create($data);

        Auditoria::registrar("CREACION_USUARIO [ID: {$usuario->id_usuario}]", 'USUARIO');

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario registrado exitosamente.');
    }

    /**
     * Formulario de edición de usuario.
     */
    public function edit(int $id): Response
    {
        $usuario = Usuario::with('rol')->findOrFail($id);

        return Inertia::render('Admin/Usuarios/Edit', [
            'usuario' => $usuario,
            'roles'   => Rol::orderBy('id_rol')->get(),
        ]);
    }

    /**
     * Actualiza los datos del usuario en feder.usuario.
     */
    public function update(UpdateUsuarioRequest $request, int $id): RedirectResponse
    {
        $usuario = Usuario::findOrFail($id);
        $data = $request->validated();

        if (!empty($data['contrasena'])) {
            $data['hash_contrasena'] = Hash::make($data['contrasena']);
        }
        unset($data['contrasena']);

        $usuario->update($data);

        Auditoria::registrar("ACTUALIZACION_USUARIO [ID: {$usuario->id_usuario}]", 'USUARIO');

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Datos del usuario actualizados correctamente.');
    }

    /**
     * Inactiva o elimina un usuario resguardando la integridad referencial.
     */
    public function destroy(int $id): RedirectResponse
    {
        if (Auth::id() === $id) {
            return redirect()->back()->with('error', 'No puedes eliminar ni inactivar tu propia cuenta activa.');
        }

        $usuario = Usuario::findOrFail($id);

        try {
            // Si el usuario tiene auditorias u operaciones previas, cambiamos a Inactivo
            if ($usuario->auditorias()->exists()) {
                $usuario->update(['estado' => 'Inactivo']);
                Auditoria::registrar("INACTIVACION_USUARIO [ID: {$id}]", 'USUARIO');
                return redirect()->route('admin.usuarios.index')
                    ->with('success', 'El usuario tiene registros históricos vinculados y fue marcado como Inactivo.');
            }

            $usuario->delete();
            Auditoria::registrar("ELIMINACION_USUARIO [ID: {$id}]", 'USUARIO');
            return redirect()->route('admin.usuarios.index')
                ->with('success', 'Usuario eliminado satisfactoriamente.');
        } catch (\Exception $e) {
            $usuario->update(['estado' => 'Inactivo']);
            Auditoria::registrar("INACTIVACION_FORZADA [ID: {$id}]", 'USUARIO');
            return redirect()->route('admin.usuarios.index')
                ->with('success', 'El usuario fue inactivado debido a restricciones de integridad.');
        }
    }
}

