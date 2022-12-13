import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Flex,
  Paper,
  NativeSelect,
  Select,
  Autocomplete,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const data = [
  { value: "inr", label: "in INR" },
  { value: "usd", label: "🇺🇸 USD" },
];

const TransactionForm = ({
  getTransactions,
  editTransaction,
  isUpdate,
  setIsUpdate,
}) => {
  const { user } = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  // form initial values
  const form = useForm({
    initialValues: {
      amount: "",
      title: "",
      date: new Date(),
      _id: "",
      category_id: "",
    },
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
      title: (value) => (value.length > 0 ? null : "Title is required"),
      date: (value) => (value ? null : "Date is required"),
      category_id: (value) => (value ? null : "Select Category"),
    },
  });

  const select = (
    <NativeSelect
      data={data}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  );

  // set form values for edit
  useEffect(() => {
    form.setValues(editTransaction);
    const Valid = editTransaction.date
      ? new Date(editTransaction.date)
      : new Date();
    setDateValue(Valid);
  }, [editTransaction]);

  // handle form submit for add and edit
  const handleTransaction = async () => {
    const { amount, title, date, _id ,category_id} = form.values;
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await fetch(
        _id
          ? `${import.meta.env.VITE_API_URL}/transaction/update/${_id}`
          : `${import.meta.env.VITE_API_URL}/transaction/add`,
        {
          method: _id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            title,
            date,
            category_id
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
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    }
    setLoading(false);
    form.reset();
    setDateValue(new Date());
    setIsUpdate(false);
    getTransactions();
  };

  function getCategoryNameById() {
    const data = user.categories.find((category) => category._id === form.values.category_id) ?? "";
    if(data.value == undefined)
    return "";
    return data.value;
  }

  const onSelectChange = (value) => {
    const {_id} = user.categories.find((o) => o.value === value);
    form.setFieldValue('category_id', _id);
  }
  return (
    <Paper
      radius="md"
      sx={{ width: "50%" }}
      p="md"
      m="md"
      shadow="xl"
      withBorder
    >
      <form onSubmit={form.onSubmit((values) => handleTransaction())}>
        <TextInput
          type="number"
          label="Amount"
          placeholder="Enter amount"
          mt="md"
          rightSection={select}
          rightSectionWidth={92}
          {...form.getInputProps("amount")}
        />
        <TextInput
          label="Transaction Title"
          placeholder="Enter transaction title"
          mt="md"
          {...form.getInputProps("title")}
        />
        <DatePicker
          placeholder="Select date"
          label="Date"
          mt="md"
          value={dateValue}
          onChange={(value) => {
            setDateValue(value);
            form.setFieldValue("date", value);
          }}
        />
        <Select
          label="Category"
          placeholder="Pick one"
          mt="md"
          name="category_id"
          {...form.getInputProps("category_id")}
          value={getCategoryNameById()}
          onChange={onSelectChange}
          data={user.categories}
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

export default TransactionForm;
