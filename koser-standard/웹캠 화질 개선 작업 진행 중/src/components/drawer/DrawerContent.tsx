"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogoutIcon } from "@icons14";
import { CHANGE_PASSWORD_INPUT } from "@constants/input";
import { MEMB_GB_CD } from "@constants/auth";
import { ImageWithAuth, Typography } from "@components/common";
import { appURI } from "@constants/env";
import { Button } from "@components/button";
import { Form, InputField } from "@components/form";
import { Modal } from "@components/modal";
import { useResponsive } from "@hooks";
import { useMutation } from "@tanstack/react-query";
import { authAtom, toastState } from "@stores";
import { useAtomValue, useSetAtom } from "jotai";
import { postLogout } from "@services/login";
import { patchChangePassword } from "@services/changePassword";
import { axiosBasicInstance } from "@services";
import Cookies from "js-cookie";

type DrawerContentProps = {
  level: string;
  isModalOpen?: boolean;
  openModal?: () => void;
  closeModal: () => void;
  profileData?: string;
  imgSrc?: string;
};

/**
 * @name DrawerContent
 * @version 1.0.1
 * @author 류창선 <zero.ryushin@bankle.co.kr>
 *         홍다인 <hdi0104@bankle.co.kr>
 * @property {string} profileData  - 회원명
 * @property {string} imgSrc       - 로고 앰블럼
 */

/**
 * @name 비밀번호변경응답(data:msg)
 * @version 1.0.0
 * @author 홍다인 <hdi0104@bankle.co.kr>
 * 00 : 변경성공
 * 01 : 현재비밀번호와 불일치
 * 02 : 글자수 미달
 * 03 : 변경할 비밀번호 불일치
 * 04 : 현재와 동일한 비밀번호
 * 99 : 사용자가 존재하지 않음
 */

export default function DrawerContent({
                                        level,
                                        isModalOpen,
                                        openModal,
                                        closeModal,
                                        profileData,
                                        imgSrc,
                                      }: DrawerContentProps) {
  const router = useRouter();
  const openToast = useSetAtom(toastState);
  const { isDesktop } = useResponsive();
  const authInfo = useAtomValue(authAtom);
  const [isDisabled, setIsDisabled] = useState(true);
  const [pwdError, setPwdError] = useState(false);
  const [newPwdError, setNewPwdError] = useState(false);
  const [reNewPwdError, setReNewPwdError] = useState(false);
  const [form, setForm] = useState({
    membNo: authInfo.membNo,
    pwd: "",
    newPwd: "",
    reNewPwd: "",
  });

  /* 토스트팝업 포지션 */
  const toastPosition = isDesktop ? "top" : "bottom";

  /* 로그아웃 api 호출 */
  const { mutate: logoutSend } = useMutation({
    mutationKey: ["log-out"],
    mutationFn: async () => await postLogout(),
    onSuccess: (res) => {
      if (res.data.code === "00") {
        // 1. 세션스토리지 'auth' 삭제
        sessionStorage.removeItem("auth");

        // 2. 쿠키의 사용자 유형 삭제
        Cookies.remove("membGbCd");

        // 3. 인터셉터 Authorization 헤더를 비우도록 처리
        axiosBasicInstance.interceptors.request.use((config) => {
          if (config.headers) {
            delete config.headers.Authorization; // 헤더에서 Authorization 제거
          }
          return config;
        });

        // 4. 1초 후 로그인 페이지 이동
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        // 5. 로그아웃실패시 토스트 팝업 노출
        // 모바일은 하단에 pc는 상단에 토스트팝업 노출
        openToast({
          message: "로그아웃에 실패하였습니다.\n다시 시도해 주세요.",
          position: toastPosition,
        });
      }
    },
    onError: (error) => {
      console.log(`${error}`);
    },
  });

  /* 로그아웃 api 호출 함수 */
  const handleLogout = () => {
    logoutSend();
  };

  /* form set 함수 */
  const resetForm = () => {
    setForm({
      membNo: authInfo.membNo,
      pwd: "",
      newPwd: "",
      reNewPwd: "",
    });
    setPwdError(false);
    setNewPwdError(false);
    setReNewPwdError(false);
    setIsDisabled(true);
  };

  /* 비밀번호변경 api 호출 */
  const { mutate: changePassword } = useMutation({
    mutationKey: ["log-in"],
    mutationFn: async () => await patchChangePassword(form),
    onSuccess: (res) => {
      if (res.data.code === "00") {
        // 1. 변경성공 토스트 팝업 노출
        openToast({
          message: `비밀번호가 변경되었습니다.`,
          position: toastPosition,
          // 2. form 리셋 & 모달 close
          afterFunc: () => {
            resetForm();
            closeModal();
          },
        });
      } else {
        console.log("code :", res.data.code);
        console.log("code :", res.data.data);
        // 3.실패시 토스트팝업 (비밀번호변경응답 코드별 메세지 다름)
        openToast({
          message: `${res.data.msg}`,
          position: toastPosition,
        });
        // 3.실패시 input별로 에러표시
        switch (res.data.data) {
          case "01":
          case "04":
            console.log("pwdError 들어옴 ✅");
            setPwdError(true);
            break;
          case "02":
            setNewPwdError(true);
            break;
          case "03":
            setReNewPwdError(true);
            break;
          default:
            console.log("switch default");
        }
      }
    },
    onError: (error) => {
      console.log(`${error}`);
    },
  });

  /* 비밀번호 form set */
  // const typingMonitor = (e: ChangeEvent<HTMLFormElement>) => {
  //   let isValid = false;

  //   if (form.pwd === "" || form.newPwd === "" || form.reNewPwd === "") {
  //     isValid = true;
  //   }

  //   setIsDisabled(isValid);

  //   const { name, value } = e.target;

  //   const filteredValue = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

  //   setForm({
  //     ...form,
  //     [name]: filteredValue,
  //   });
  // };

  /* 비밀번호 input change - 한글입력제어추가 */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 한글 포함 여부 확인
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value);

    if (hasKorean) {
      openToast({
        message: "비밀번호에는 한글을 입력할 수 없습니다.",
        position: isDesktop ? "top" : "bottom",
      });
    }

    // 한글 제거 (유니코드 한글 블록)
    const filteredValue = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

    const updatedForm = {
      ...form,
      [name]: filteredValue,
    };

    setForm(updatedForm);

    // 버튼 활성화 여부 판단
    const isAnyEmpty =
      updatedForm.pwd === "" ||
      updatedForm.newPwd === "" ||
      updatedForm.reNewPwd === "";

    setIsDisabled(isAnyEmpty);
  };

  /* 비밀번호변경 api 호출 함수 */
  const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changePassword();
  };

  return (
    <div className="_drawer-content">
      {/* NOTE: 금융기관(신협) 케이스에서만 노출 */}
      {level === MEMB_GB_CD.FINANCIAL && (
        <div className="_drawer-content-inner-wrapper">
          <ImageWithAuth
            src={`${appURI}/api${imgSrc}`}
            alt={`${profileData} 로고` || "로고 이미지"}
            width={48}
            height={48}
          />
          <Typography kind="body-large" isBold={true}>
            {!!profileData ? profileData : "금융기관"}
          </Typography>
        </div>
      )}

      <div className="_drawer-content-inner-wrapper">
        {level !== MEMB_GB_CD.ADMIN && (
          <Button shape="solid" size="sm" color="main5" onClick={openModal}>
            비밀번호 변경
          </Button>
        )}

        <Button
          shape="outline"
          size="sm"
          color="grayscale"
          icon={
            <Image
              src={LogoutIcon}
              alt="로그아웃 아이콘"
              width={14}
              height={14}
            />
          }
          iconPosition="right"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>

      {isModalOpen && (
        <Modal title="비밀번호 변경" onClose={closeModal} size="md">
          <Form
            onSubmit={handleChangePassword}
            legendText="비밀번호 변경 양식"
            isHiddenLegend={true}
            // onChange={typingMonitor}
            className="_change-password-form"
          >
            <div>
              <InputField
                name="pwd"
                // defaultValue={form.pwd}
                value={form.pwd}
                htmlFor={CHANGE_PASSWORD_INPUT.currentLabelText}
                labelText={CHANGE_PASSWORD_INPUT.currentLabelText}
                type="password"
                inputSize={isDesktop ? "lg" : "md"}
                required={true}
                placeholder={CHANGE_PASSWORD_INPUT.currentPassword}
                errorMessage={CHANGE_PASSWORD_INPUT.currentErrorText}
                isError={pwdError}
                onFocus={() => setPwdError(false)}
                onChange={handleInputChange}
                // disabled={true}
              />
            </div>
            <div>
              <InputField
                name="newPwd"
                // defaultValue={form.newPwd}
                value={form.newPwd}
                htmlFor={CHANGE_PASSWORD_INPUT.newLabelText}
                labelText={CHANGE_PASSWORD_INPUT.newLabelText}
                type="password"
                inputSize={isDesktop ? "lg" : "md"}
                required={true}
                placeholder={CHANGE_PASSWORD_INPUT.newPassword}
                errorMessage={CHANGE_PASSWORD_INPUT.newErrorText}
                isError={newPwdError}
                onFocus={() => setNewPwdError(false)}
                onChange={handleInputChange}
                // disabled={true}
              />
              <InputField
                name="reNewPwd"
                // defaultValue={form.reNewPwd}
                value={form.reNewPwd}
                htmlFor=""
                labelText=""
                type="password"
                inputSize={isDesktop ? "lg" : "md"}
                required={true}
                placeholder={CHANGE_PASSWORD_INPUT.repeatPassword}
                errorMessage={CHANGE_PASSWORD_INPUT.repeatErrorText}
                isError={reNewPwdError}
                onFocus={() => setReNewPwdError(false)}
                onChange={handleInputChange}
                // disabled={true}
              />
            </div>
            <Button
              shape="solid"
              size="lg"
              color="main100"
              type="submit"
              disabled={isDisabled}
            >
              비밀번호 변경
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
}
