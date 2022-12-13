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
import { useSelector } from "react-redux";
import TransactionChart from "./TransactionChart";

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

const TransactionList = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const token = Cookies.get('token');
  const { user } = useSelector((state) => state.auth.user);
  // get transactions
  const getTransactions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/get`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      setTransactions(responseData.data);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  // delete transaction
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transaction/delete/${id}`,
        {
          method: "DELETE",
          headers : {
            Authorization : `Bearer ${token}`
          }
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      getTransactions();
      showNotification({
        title: responseData.message,
        color: "red",
        icon: <IconTrash />,
      });
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
        <Text size="sm">
          Are you sure you want to delete your transaction ?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      overlayBlur: 3,
      overlayOpacity: 0.55,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteTransaction(id),
  });

  // get transactions on mount
  useEffect(() => {
    getTransactions();
  }, []);
 const getCategoryName = (id) =>{
  const Name = user.categories.find((category)=>category._id === id);
  return Name ? Name.label : "NA";
 }
  // make records
  const rows = transactions.map((element, id) => (
    <tr key={id}>
      <td>{element.title}</td>
      <td>{element.amount}</td>
      <td>{getCategoryName(element.category_id)}</td>
      <td>{dayjs(element.date).format("DD-MMM, YYYY")}</td>
      <td>
        <Button
          leftIcon={<IconPencil size={14} />}
          color="blue"
          size="xs"
          mr={4}
          onClick={() => {setIsUpdate(true); setEditTransaction(element)}}
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
      <TransactionChart getTransactions={getTransactions}/>
      <TransactionForm getTransactions={getTransactions} editTransaction={editTransaction} isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
      <Paper
        radius="md"
        sx={{ width: "90%" }}
        p="md"
        m="md"
        shadow="xl"
        justify="center"
        withBorder
      >
        {loading ? (
          <Loader />
        ) : (
          <ScrollArea
            sx={{ height: 300 }}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table highlightOnHover>
              <thead
                className={cx(classes.header, { [classes.scrolled]: scrolled })}
              >
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>
    </Flex>
  );
};

export default TransactionList;
