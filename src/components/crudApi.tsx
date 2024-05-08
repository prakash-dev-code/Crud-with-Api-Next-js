"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Table, Tag, Typography, message } from "antd";
import type { TableProps } from "antd";
import axios from "axios";

interface DataType {
  id: string;
  title: string;
  brand: string;
  price: number;
}

const CrudApi = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataType>({} as any);
  const [data, setData] = useState<DataType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const GetAllProducts = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/products");
      const data = res?.data.products;
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetAllProducts();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const showModal = () => {
    setIsModalOpen(true);
    setFormData({} as DataType);
  };

  // handle add product

  const handleOk = async () => {
    try {
      let res;
      if (isEditing) {
        // Update existing product
        res = await axios.put(
          `https://dummyjson.com/products/${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Add new product
        res = await axios.post("https://dummyjson.com/products/add", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (res.status === 200) {
        message.success(
          isEditing
            ? "Product updated successfully"
            : "Product added successfully"
        );
        setIsModalOpen(false);
        GetAllProducts();
      } else {
        message.error("Failed to update product");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  // handle add product

  // handle cancel modal

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({} as DataType);
    setIsEditing(false);
  };

  // handle cancel modal

  // handle Delete

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`https://dummyjson.com/products/${id}`);
      if (res.status === 200) {
        setData(data.filter((item) => item.id !== id));
        message.success("Product deleted successfully");
      } else {
        message.error("something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle Delete

  // handle Edit
  const handleEdit = async (record: any) => {
    setFormData(record);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",

      render: (title) => <Typography>{title}</Typography>,
    },
    {
      title: "Brand",
      dataIndex: "brand",

      render: (brand) => <Typography>{brand}</Typography>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => <Typography>{price}</Typography>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record: DataType) => (
        <Space size="middle">
          <Button type="primary" onClick={(e: any) => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={(e: any) => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-5 w-full mt-10 ">
        <div className="text-end">
          <Button className="bg-black text-white " onClick={showModal}>
            Add Product
          </Button>
        </div>
        <div className="border rounded">
          <Table columns={columns} dataSource={data} rowKey="id" />
        </div>
      </div>

      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleOk}
        okText={isEditing ? "Update" : "Submit"}
        onCancel={handleCancel}>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Title here..."
              className="w-full px-4  py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Brand here..."
              className="w-full px-4  py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Enter Price here..."
              className="w-full px-4  py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CrudApi;
