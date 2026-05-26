-- Create a private schema not exposed by the REST API
CREATE SCHEMA IF NOT EXISTS private;

-- Move the SECURITY DEFINER helper out of the public (REST-exposed) schema
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

-- Lock down execute privileges
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;