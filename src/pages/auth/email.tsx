import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function ConfirmarEmailPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processando'); // processando, sucesso, erro
    const navigate = useNavigate();

    useEffect(() => {
        const key = searchParams.get('key');
        
        if (!key) {
            setStatus('erro');
            return;
        }

        // Faz o POST seguro por baixo dos panos para a sua API
        axios.post('/api/v1/accounts/verify-email/', { key })
            .then(() => {
                setStatus('sucesso');
                // Redireciona para o login após 3 segundos, por exemplo
                setTimeout(() => navigate('/auth/sign-in'), 3000);
            })
            .catch(() => {
                setStatus('erro');
            });
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            {status === 'processando' && <h2>Validando seu cadastro, por favor aguarde... ⏳</h2>}
            {status === 'sucesso' && <h2>E-mail confirmado com sucesso! Redirecionando... 🎉</h2>}
            {status === 'erro' && <h2>Ops! Esse link de confirmação é inválido ou já expirou. ❌</h2>}
        </div>
    );
}