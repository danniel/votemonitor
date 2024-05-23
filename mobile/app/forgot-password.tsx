import Header from "../components/Header";
import { Screen } from "../components/Screen";
import { useTranslation } from "react-i18next";
import { Icon } from "../components/Icon";
import { router } from "expo-router";
import { YStack } from "tamagui";
import { Typography } from "../components/Typography";
import { useForm, Controller } from "react-hook-form";
import FormInput from "../components/FormInputs/FormInput";
import Card from "../components/Card";
import Button from "../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import PasswordConfirmationScreen from "../components/PasswordConfirmationScreen";
import { ForgotPasswwordPayload, forgotPassword } from "../services/definitions.api";
import * as Sentry from "@sentry/react-native";
import CredentialsError from "../components/CredentialsError";

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("forgot_password");
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const [authError, setAuthError] = useState(false);

  // React Hook form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({});

  // Submit handler - forgot password
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const payload: ForgotPasswwordPayload = { email: data.email };
      await forgotPassword(payload);
      setEmailConfirmation(true);
    } catch (error) {
      Sentry.captureException(error);
      setAuthError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailConfirmation) {
    return <PasswordConfirmationScreen icon="emailSent" translationKey="forgot_password" />;
  }

  return (
    <Screen
      preset="auto"
      ScrollViewProps={{
        bounces: false,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Header
        title={t("header.title")}
        titleColor="white"
        barStyle="light-content"
        leftIcon={<Icon icon="chevronLeft" color="white" />}
        onLeftPress={() => router.back()}
      />

      <YStack paddingHorizontal="$md" gap="$md" paddingTop={10 + insets.top}>
        <Typography preset="heading" fontWeight="700">
          {t("heading")}
        </Typography>

        <Typography>{t("paragraph")}</Typography>
        {authError && <CredentialsError error={t("form.errors.invalid_email")} />}

        <Controller
          key="email"
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: t("form.email.required"),
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: t("form.email.pattern"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              type="text"
              title={t("form.email.label")}
              placeholder={t("form.email.placeholder")}
              value={value}
              onChangeText={onChange}
              error={errors?.email?.message?.toString()}
            />
          )}
        />
      </YStack>

      <Card width="100%" paddingBottom={16 + insets.bottom} marginTop="auto">
        <Button disabled={isLoading} onPress={handleSubmit(onSubmit)}>
          {isLoading ? t("form.submit.loading") : t("form.submit.save")}
        </Button>
      </Card>
    </Screen>
  );
};

export default ForgotPassword;
