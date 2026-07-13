import { useState } from 'react'
import { Camera } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import type { User, UserUpdate } from '../../../schemas/user'
import { formatCPF, formatPhone, unformatPhone } from '../../../utils/formatters'
import { useUpdateProfile } from '../../../hooks/accounts/useUsers'

type PersonalDataProps = {
  user: User
}

export function PersonalData({ user }: PersonalDataProps) {
  const [form, setForm] = useState<UserUpdate>({
    username:      user.username,
    first_name:    user.first_name,
    last_name:     user.last_name,
    email:         user.email,
    phone_number:  user.phone_number,
    date_of_birth: user.date_of_birth,
    bio:           user.bio,
  })

  // Estados para upload de avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const profileMutation = useUpdateProfile()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    let formattedValue = value
    
    if (name === 'phone_number') {
      formattedValue = formatPhone(value)
    }
   
    setForm(prev => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida')
      return
    }

    // Validação de tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    // Cria preview da imagem
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Salva o arquivo para enviar depois
    setAvatarFile(file)
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const payload = {
    ...form,
    phone_number: form.phone_number
      ? unformatPhone(form.phone_number)
      : form.phone_number,
  };

  try {
    if (avatarFile) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append("profile_image", avatarFile);

      await profileMutation.mutateAsync(formData);
    } else {
      await profileMutation.mutateAsync(payload);
    }
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="bg-card rounded-2xl p-6 flex-1 flex-col gap-6">

    
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-surface overflow-hidden flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
            ) : user.profile_image ? (
              <img src={user.profile_image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera size={48} className="text-primary/30" />
            )}
          </div>
          <label
            htmlFor="avatar"
            className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-dark transition-colors"
          >
            <Camera size={18} />
            <input 
              id="avatar" 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <Button 
          size="sm" 
          variant="success"
          onClick={() => document.getElementById('avatar')?.click()}
        >
          Alterar Foto
        </Button>
      </div>

    
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nome"
            name="first_name"
            value={form.first_name ?? ''}
            onChange={handleChange}
            placeholder="Valdivania"
            required
          />
          <Input
            label="Sobrenome"
            name="last_name"
            value={form.last_name ?? ''}
            onChange={handleChange}
            placeholder="Silva"
            required
          />
        </div>

        <Input
          label="CPF"
          name="cpf"
          value={formatCPF(user.cpf ?? '')}
          placeholder="000.000.000-00"
          disabled
        />

        <Input
          label="Username"
          name="username"
          value={form.username ?? ''}
          onChange={handleChange}
          placeholder="valdivania"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email ?? ''}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />

        <Input
          label="Data de Nascimento"
          name="date_of_birth"
          type="date"
          value={form.date_of_birth ?? ''}
          onChange={handleChange}
        />

        <Input
          label="Telefone"
          name="phone_number"
          type="tel"
          value={form.phone_number ?? ''}
          onChange={handleChange}
          placeholder="(84) 99999-9999"
          maxLength={15}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={profileMutation.isPending}
          >
            {profileMutation.isPending
              ? "Salvando..."
              : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
}