import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Flex,
  PasswordInput,
  Paper,
  Group,
  Anchor,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconLock, IconX } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const [loading,setLoading] = useState();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 4 ? "Password must be 4 characters" : null,
    },
  });

  const handleLogin = async () => {
    setLoading(true);
    const { email, password } = form.values;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const { message, token, user } = await response.json();

      if (response.ok) {
        Cookies.set("token", token);
        dispatch(setUser(user));
        // navigate("/");
        window.location.href = '/';
      } else {
        showNotification({
          title: message,
          message: "Please Enter Right Credential",
          color: "red",
          icon: <IconX />,
          radius:"lg"
        });
      }
      console.log(message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Flex justify="center" align="center" w="100%" h="80vh">
      <Paper radius="md" sx={{ width: "50%" }} shadow="xl" withBorder p="md">
        <Title order={1} align="center">
          Sign In
        </Title>
        <form onSubmit={form.onSubmit((values) => handleLogin())}>
          <TextInput
            label="Email"
            placeholder="Email"
            mt="md"
            icon={<IconAt size={18} />}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            mt="md"
            icon={<IconLock size={18} />}
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => navigate("/register")}
              size="xs"
            >
              You don't have an account?
            </Anchor>
            <Button color="violet" radius="lg" type="submit" mt="md" loading={loading}>
              Sign In
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
};

export default Login;
