export function BufferImageToBase64String(user){
  return user?.fotoPerfil ? Buffer.from(user?.fotoPerfil).toString('base64') : null;
}