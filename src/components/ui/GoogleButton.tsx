import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLogin as useBackendGoogleLogin } from "../../hooks/accounts/useAuth";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import iconGoogle from '../../assets/google-icon-logo-svgrepo-com.svg'

export function ButtonGoogle() {
  const navigate = useNavigate();
  const backendLogin = useBackendGoogleLogin();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const { data } = await backendLogin.mutateAsync({
          code,
        });

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        navigate("/");
      } catch (err) {
        console.error(err);
      }
    },
    onError: () => {
      console.error("Erro ao autenticar com Google");
    },
  });

  return ( 
    <Button variant='google' onClick={() => login()}>
      <img src={iconGoogle} alt="" className="w-5 h-5" />
      Continuar com o google
    </Button>

)}