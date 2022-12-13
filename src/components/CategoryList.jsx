import {
  ActionIcon,
  Button,
  createStyles,
  Flex,
  Loader,
  Paper,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import { openConfirmModal } from "@mantine/modals";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/authSlice";
import CategoryForm from "./CategoryForm";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    zIndex: 10,
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const CategoryList = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [editTransaction, setEditTransaction] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);
  // delete Category
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/category/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        const DeleteFromStore = {
          ...user,
          categories: user.categories.filter(
            (category) => category._id != id
          ),
        };
        dispatch(
          setUser({user:DeleteFromStore})
        );
        showNotification({
          title: responseData.message,
          color: "red",
          icon: <IconTrash />,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // confirm delete
  const openDeleteModal = (id) =>
    openConfirmModal({
      title: "Delete your profile",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete your Category ?</Text>
      ),
      labels: { confirm: "Delete", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      overlayBlur: 3,
      overlayOpacity: 0.55,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteCategory(id),
    });

  // make records
  const rows = user.categories.map((element, id) => (
    <tr key={id}>
      <td>{element.label}</td>
      <td>{element.icon}</td>
      <td>
        <Button
          leftIcon={<IconPencil size={14} />}
          color="blue"
          size="xs"
          mr={4}
          onClick={() => {
            setIsUpdate(true);
            setEditTransaction(element);
          }}
        >
          Edit
        </Button>
        <Button
          leftIcon={<IconTrash size={14} />}
          color="red"
          size="xs"
          onClick={() => openDeleteModal(element._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <Flex justify="center" align="center" w="100%" direction="column" m="md">
      <CategoryForm editTransaction={editTransaction} isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
      <Paper
        radius="md"
        sx={{ width: "90%" }}
        p="md"
        m="md"
        shadow="xl"
        justify="center"
        withBorder
      >
        <ScrollArea
          sx={{ height: 300 }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table highlightOnHover>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Flex>
  );
};

export default CategoryList;
