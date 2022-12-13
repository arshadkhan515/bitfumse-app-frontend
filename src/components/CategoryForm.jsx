import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Paper, Select } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

const icons = [
  { value: "Health", label: "Health" },
  { value: "Guest", label: "Guest" },
];

const CategoryForm = ({ editTransaction, isUpdate, setIsUpdate }) => {
  const { user } = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // form initial values
  const form = useForm({
    initialValues: {
      label: "",
      _id: "",
      icons: "",
    },
    validate: {
      label: (value) => (value ? null : "Label is required"),
      icons: (value) => (value ? null : "Select Icons"),
    },
  });

  // set form values for edit
  useEffect(() => {
    form.setValues({...editTransaction,icons:editTransaction.icon});
  }, [editTransaction]);

  // handle form submit for add and edit
  const handleCategory = async () => {
    const { label, _id, icons } = form.values;
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await fetch(
        _id
          ? `${import.meta.env.VITE_API_URL}/category/update/${_id}`
          : `${import.meta.env.VITE_API_URL}/category/add`,
        {
          method: _id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            label,
            icons,
          }),
        }
      );
      const data = await response.json();

      response.ok
        ? showNotification({
            title: data.message,
            color: "teal",
            icon: <IconCheck />,
          })
        : null;
        window.location.href = "/";
    } catch (error) {
      showNotification({
        title: "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    }
    setLoading(false);
    form.reset();
    setIsUpdate(false);
  };

  function getCategoryNameById() {
    const data =
      user.categories.find(
        (category) => category.icon == form.values.icons
      );
    if (data == undefined) return "";
    return data.icon;
  }

  const onSelectChange = (value) => {
    form.setFieldValue("icons", value);
  };
  return (
    <Paper
      radius="md"
      sx={{ width: "50%" }}
      p="md"
      m="md"
      shadow="xl"
      withBorder
    >
      <form onSubmit={form.onSubmit((values) => handleCategory())}>
        <TextInput
          label="Category Label"
          placeholder="Enter Category Label"
          mt="md"
          {...form.getInputProps("label")}
        />

        <Select
          label="Icons"
          placeholder="Pick one"
          mt="md"
          name="icons"
          {...form.getInputProps("icons")}
          value={getCategoryNameById()}
          onChange = {onSelectChange}
          data={icons}
        />

        {isUpdate && (
          <TextInput
            type="hidden"
            value={editTransaction._id}
            {...form.getInputProps("_id")}
          />
        )}

        <Button
          color="violet"
          radius="lg"
          type="submit"
          mt="md"
          loading={loading}
        >
          {isUpdate ? "Update" : "Add"}
        </Button>
      </form>
    </Paper>
  );
};

export default CategoryForm;
