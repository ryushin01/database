import Image, { ImageProps } from "next/image";

interface ImageWithAuthProps extends Omit<ImageProps, "src"> {
  src: string;
}

/**
 * @name ImageWithAuth
 * @version 1.0.0
 * @author 이은희 <leun1013@bankle.co.kr>
 * @description 인증이 필요한 이미지를 표시하기 위한 컴포넌트입니다.
 *              세션스토리지에서 토큰을 가져와 이미지 프록시를 통해 이미지를 요청합니다.
 * @property {string} src  - 이미지 url
 */

export default function ImageWithAuth({ src, ...props }: ImageWithAuthProps) {
  const auth =
    typeof window !== "undefined" ? sessionStorage.getItem("auth") : null;
  let token = "";
  if (auth) {
    const parsedAuth = JSON.parse(auth);
    token = parsedAuth.accessToken;
  }

  const proxyUrl = `/api/img-proxy?url=${encodeURIComponent(src)}&key=${token}`;

  return <Image src={proxyUrl} {...props} />;
}
