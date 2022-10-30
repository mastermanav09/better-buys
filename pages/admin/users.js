import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../utils/store/reducers/admin";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";
import { navLinks } from "../../utils/navlinks";
import { useRouter } from "next/router";
import PageLoader from "../../components/progress/PageLoader";
import LoadingSpinner from "../../components/svg/LoadingSpinner";
import Link from "next/link";
import { adminActions } from "../../utils/store/reducers/admin";
import { deleteUser } from "../../utils/store/reducers/admin";

const Users = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, users, loadingDelete, successDelete } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (successDelete) {
      dispatch(adminActions.deleteReset());
    } else if (users.length == 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, successDelete, users]);

  const deleteHandler = async (userId) => {
    if (!window.confirm("Are you sure you want to delete the user ?")) {
      return;
    }

    dispatch(deleteUser(userId));
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <div>
        <AdminSidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center ">{error}</div>
          ) : (
            <div className="my-16">
              <div className="mb-8">
                <h1 className="text-center text-2xl md:text-left md:text-3xl lg:text-4xl align-middle">
                  Users
                </h1>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="p-5 text-left">NAME</th>
                      <th className="p-5 text-left">EMAIL</th>
                      <th className="p-5 text-left">IS ADMIN</th>
                      <th className="p-5 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b text-sm">
                        <td className="p-5">{user._id.substr(20, 24)}</td>
                        <td className="p-5">{user.credentials.name}</td>
                        <td className="p-5">{user.credentials.email}</td>
                        <td className="p-5">
                          {user.credentials.isAdmin ? (
                            <span className="text-green-500">Yes</span>
                          ) : (
                            <span className="text-red-500">No</span>
                          )}
                        </td>
                        <td className="p-5 items-center">
                          <Link href={`/admin/user/${user._id}`} passHref>
                            <a className="mx-1 text-blue-400">
                              <button className="inline-block p-2 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                Edit
                              </button>
                            </a>
                          </Link>
                          &nbsp;
                          <button
                            className="inline-block p-2 bg-red-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                            onClick={() => deleteHandler(user._id)}
                            disabled={loadingDelete}
                          >
                            {loadingDelete === user._id ? (
                              <LoadingSpinner className="mx-auto w-[2.5rem] h-4 text-red-200 animate-spin fill-white" />
                            ) : (
                              <> Delete</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Users.auth = { adminOnly: true };
export default React.memo(Users);
