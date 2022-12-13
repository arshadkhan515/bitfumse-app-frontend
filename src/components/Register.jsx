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
  Grid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconAt, IconLock, IconMail } from "@tabler/icons";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 3 ? "First Name must be 3 characters" : null,
      lastName: (value) =>
        value.length < 3 ? "Last Name must be 3 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 4 ? "Password must be 4 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });
  const handleSignUp = async() =>{
    setLoading(true);
    const {firstName,lastName,email,password} = form.values;
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          firstName,
          lastName,
          email,
          password
        }),
      })

      const data = await response.json();
      if(response.ok){
        navigate('/login');
      }
    }catch(e){
      console.log(e);
    }
    setLoading(false);
  }
  return (
    <Flex justify="center" align="center" w="100%" h="90vh">
      <Paper radius="md" sx={{ width: "50%" }} shadow="xl" withBorder p="md">
        <Title order={1} align="center">
          Sign Up
        </Title>
        <form
          onSubmit={form.onSubmit((values) =>
            // alert(JSON.stringify(values, null, 2))
            handleSignUp()
          )}
        >
          <Grid grow>
          <Grid.Col span={4}>
            <TextInput
              label="First Name"
              placeholder="First Name"
              mt="md"
              {...form.getInputProps("firstName")}
            />
            </Grid.Col>
            <Grid.Col span={4}>
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              mt="md"
              {...form.getInputProps("lastName")}
            />
            </Grid.Col>
          </Grid>
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
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            mt="md"
            icon={<IconLock size={18} />}
            {...form.getInputProps("confirmPassword")}
          />
          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => navigate("/login")}
              size="xs"
            >
              Already have an account? Login
            </Anchor>
            <Button color="violet" radius="lg" type="submit" mt="md" loading={loading}>
              Sign Up
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
};

export default Register;
