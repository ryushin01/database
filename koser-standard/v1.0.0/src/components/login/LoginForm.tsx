"use client";

import { FormEvent, useEffect, ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AUTH_LIST } from "@constants/auth";
import { AD_ASSIGN, FI_HOME } from "@constants/path";
import { ID_INPUT, ID_SAVER, PASSWORD_INPUT } from "@constants/input";
import { Checkbox, Form, InputField, Radio } from "@components/form";
import { Button } from "@components/button";
import { Loading } from "@components/common";
import { postLoginData } from "@services/login";
import { useRadio } from "@hooks";
import { ResponsiveType } from "@types";
import { useMutation } from "@tanstack/react-query";
import { authAtom, toastState } from "@stores";
import { useAtom, useSetAtom } from "jotai";
import Cookies from "js-cookie";
import LoginPasswordField from "./LoginPasswordField";

/**
 * @name membGbCd(사용자구분코드)
 * @version 1.0.0
 * @author 홍다인 <hdi0104@bankle.co.kr>
 * 00 : 금융기관
 * 10 : 법무대리인
 * 20 : 관리자
 */

export default function LoginForm({ isDesktop }: ResponsiveType) {
  const openToast = useSetAtom(toastState);
  const [, saveAuthInfo] = useAtom(authAtom);
  const router = useRouter();
  const [radioValue, handleRadio] = useRadio("00");
  const [isChecked, setIsChecked] = useState(false);
  const [idError, setIdError] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [form, setForm] = useState({
    id: "",
    pwd: "",
    membGbCd: "00",
  });

  /* 페이지 렌더링시점에 로컬스토리지에 저장된 userId가 있으면 id에 form 재세팅 및 체크박스 활성화 */
  useEffect(() => {
    const getUserId = localStorage.getItem("userId");
    if (getUserId) {
      setForm({ id: getUserId, pwd: "", membGbCd: "00" });
      setIsChecked(true);
    }
  }, []);

  /* 체크박스 핸들러 */
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };

  /* 로그인 api 호출 */
  const {
    // data: loginData,
    mutate: loginDataSend,
    isPending: loginDataLoading,
  } = useMutation({
    mutationKey: ["log-in"],
    mutationFn: async () => await postLoginData(form),
    onSuccess: (res) => {
      if (res.data.code === "00") {
        // 1. authAtom에 저장 (세션스토리지에도 'auth'로 함께 저장됨)
        saveAuthInfo({ ...res.data.data });

        // 2. 세션 스토리지 저장 시 쿠키에 사용자 유형(membGbCd) 저장
        Cookies.set("membGbCd", res.data.data.membGbCd);

        // 3. id 저장 true이면 로컬스토리지에 userId 저장 false 이면 삭제
        if (isChecked) {
          localStorage.setItem("userId", form.id);
        } else {
          localStorage.removeItem("userId");
        }

        // 4. 1초 후 membGbCd에 따라서 페이지 이동
        setTimeout(() => {
          switch (res.data.data.membGbCd) {
            case "00":
              router.push(FI_HOME);
              break;
            case "10":
              // router.push();
              break;
            case "20":
              router.push(AD_ASSIGN);
              break;
            default:
              break;
          }
        }, 1000);
      } else {
        /* TODO : 법무대리인 서비스 이후는 아래 코드 삭제 */
        if (radioValue === "10") {
          openToast({
            message: "법무대리인 서비스는 준비 중입니다.",
            position: isDesktop ? "top" : "bottom",
          });
          return;
        }
        // 5. id 또는 password 불일치시 토스트팝업 (모바일은 하단에 pc는 상단에 토스트팝업 노출)
        openToast({
          message:
            "아이디 또는 비밀번호가 일치하지 않습니다.\n다시 확인해 주세요.",
          position: isDesktop ? "top" : "bottom",
        });
      }
    },
    onError: (error) => {
      console.log(`${error}`);
    },
  });

  /* 1. 로그인 input 입력 여부 체크 */
  const checkValidation = () => {
    let isValid = true;

    if (form.id === "") {
      setIdError(true);
      isValid = false;
    }
    if (form.pwd === "") {
      setPwdError(true);
      isValid = false;
    }

    return isValid;
  };

  /* 2. 로그인 form set */
  const setLoginForm = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* 3. 로그인 데이터 api 호출 */
  const submitLoginForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!checkValidation()) {
      return; // checkValidation 통과 안되면 return
    }

    loginDataSend();
  };

  return (
    <>
      {loginDataLoading && <Loading />}
      <Form
        onSubmit={submitLoginForm}
        onChange={setLoginForm}
        legendText="로그인"
        isHiddenLegend={true}
        className="_login-form"
      >
        <div className="_login-radio-wrapper">
          {AUTH_LIST.map((auth) => {
            const { id, name, value, labelText, disabled } = auth;

            return (
              <div key={id}>
                <Radio
                  name={name}
                  value={value}
                  labelText={labelText}
                  checked={radioValue === value}
                  disabled={disabled}
                  onChange={handleRadio}
                  isDesktop={isDesktop}
                />
              </div>
            );
          })}
        </div>
        <InputField
          type="text"
          name="id"
          defaultValue={form.id}
          required={false}
          placeholder={ID_INPUT.placeHolder}
          inputMessage={ID_INPUT.labelText}
          errorMessage={ID_INPUT.errorText}
          icon={
            <Image
              src={ID_INPUT.icon}
              alt="유저 아이콘"
              width={20}
              height={20}
            />
          }
          iconPosition="left"
          isError={idError}
          onFocus={() => setIdError(false)}
          inputSize={isDesktop ? "lg" : "md"}
          // disabled={true}
        />
        <LoginPasswordField
          type="password"
          name="pwd"
          defaultValue={form.pwd}
          required={false}
          placeholder={PASSWORD_INPUT.placeHolder}
          inputMessage={PASSWORD_INPUT.labelText}
          errorMessage={PASSWORD_INPUT.errorText}
          icon={
            <Image
              src={PASSWORD_INPUT.icon}
              alt="자물쇠 아이콘"
              width={20}
              height={20}
            />
          }
          iconPosition="left"
          isError={pwdError}
          onFocus={() => setPwdError(false)}
          inputSize={isDesktop ? "lg" : "md"}
          // disabled={true}
        />
        <div className="_login-checkbox-wrapper">
          <Checkbox
            name={ID_SAVER.name}
            labelText={ID_SAVER.labelText}
            checked={isChecked}
            disabled={ID_SAVER.disabled}
            onChange={handleCheckboxChange}
          />
        </div>
        <Button
          // TODO: 로직 개발 시 submit 주석 해제
          type="submit"
          shape="solid"
          size="lg"
          color="main100"
          // onClick={() => {}}
        >
          로그인
        </Button>
      </Form>
    </>
  );
}
