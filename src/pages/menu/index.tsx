import React, {useEffect, useState, useMemo} from "react"
import { Button, Divider, Table, Tag, Space, TablePaginationConfig, Popconfirm } from 'antd';
import { antdIcons } from '~/assets/antd-icons';
import { antdUtils } from '~/utils/antd';
import { t } from "~/utils/i18n";
import { useRequest } from '~/hooks/use-request';
import menuService, { Menu } from './service';
import { MenuType } from "./interface";
import NewAndEditForm from './new-edit-form';
import { WithAuth } from "~/components/with-auth";
import { PlusOutlined } from "@ant-design/icons";


const MenuPage:React.FC = () => {
    const [dataSource, setDataSource] = useState<Menu[]>([])
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
      });

  const [createVisible, setCreateVisible] = useState(false);
  const [parentId, setParentId] = useState<string>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);
  const [curRowData, setCurRowData] = useState<Menu>();
  const [editData, setEditData] = useState<null | Menu>(null);

  const { loading, runAsync: getMenusByPage } = useRequest(menuService.getMenusByPage, { manual: true});
  const getMenus = async () => {
    const {current, pageSize} = pagination || {}
  
    const [error, data] = await getMenusByPage({
        current,
        pageSize
    })
    if(!error){
        setDataSource(data.data.map((item:any) => ({
            ...item,
            children: item.hasChild ? [] : null
        }))
    )
        setPagination(pre => ({
            ...pre,
            total: data.total
        }))
    }
  }

  const CreateButton = WithAuth('menu:create')(Button)
  const columns: any[] = useMemo(
    () => [
      {
        title: t('LhjNVSoc'),
        dataIndex: 'name',
        width: 170,
      },
      {
        title: t('QkaYSPaL'),
        dataIndex: 'type',
        align: 'center',
        width: 100,
        render: (value: number) => (
          <Tag color="processing">{value === MenuType.DIRECTORY ? '目录' : value === MenuType.MENU ? '菜单' : '按钮'}</Tag>
        ),
      },
      {
        title: t('QlaYSPaM'),
        align: 'center',
        width: 100,
        dataIndex: 'icon',
        render: value => antdIcons[value] && React.createElement(antdIcons[value])
      },
      {
        title: t('QmaYSPaN'),
        dataIndex: 'route',
      },
      {
        title: 'url',
        dataIndex: 'url',
      },
      {
        title: t('QnaYSPaO'),
        dataIndex: 'filePath',
      },
      {
        title: t('QoaYSPaP'),
        dataIndex: 'orderNumber',
        width: 100,
      },
      {
        title: t('QpaYSPaQ'),
        dataIndex: 'authCode'
      },
      {
        title: t('QkOmYwne'),
        dataIndex: 'id',
        align: 'center',
        width: 200,
        render: (value: string, record: Menu) => {
          return (
            <Space
              split={(
                <Divider type='vertical' />
              )}
            >
              <a
                onClick={() => {
                  setParentId(value);
                  setCreateVisible(true);
                  setCurRowData(record);
                }}
              >
                {t('QgaYSPai')}
              </a>
              <a
                onClick={() => {
                  setEditData(record);
                  setCreateVisible(true);
                }}
              >
               {t('qEIlwmxC')}
              </a>
              <Popconfirm
                
                title={t('nlZBTfzL')}
                cancelText={t('QapYSPaT')}
                okText={t('QbaYSPaU')}
                onConfirm={async () => {
                  
                  const [error] = await menuService.removeMenu(value);

                  if (!error) {
                    antdUtils.message?.success(t('bvwOSeoJ'));
                    getMenus();
                    setExpandedRowKeys([]);
                  }
                }}
                placement='topRight'
              >
                <a>{t('HJYhipnp')}</a>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [],
  );
  const cancelHandle = () => {
    setCreateVisible(false);
    setEditData(null)
  }

  const saveHandle = () => {
    setCreateVisible(false)
    setEditData(null)
    if(!curRowData){
        getMenus()
        setExpandedRowKeys([])
    } else {
        curRowData._loaded_ = false
        expandHandle(true, curRowData)
    }
  }

 const expandHandle = async(expanded: boolean, record: Menu) => {
              if(expanded && !record._loaded_) {
                const [error, children] =  await menuService.getChildren(record.id);
                if(!error) {
                    record._loaded_ = true
                    record.children = (children || []).map((item: Menu) => ({
                        ...item,
                        children: item.hasChild ? [] : null
                    }));
                    setDataSource([...dataSource])
                }
              }
 }

 const tabChangeHandle = (tablePagination: TablePaginationConfig) => {
  setPagination(tablePagination);
}

 useEffect(() => {
    getMenus()
    console.log(pagination.pageSize, pagination.current);
    
 }, [pagination.size, pagination.current])



  return (
    <div>
      <CreateButton
        className="mb-[12px]"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setCreateVisible(true);
        }}
      >
      {t('morEPEyc')}
      </CreateButton>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={tabChangeHandle}
        tableLayout="fixed"
        expandable={{
          rowExpandable: () => true,
          onExpand: expandHandle,
          expandedRowKeys,
          onExpandedRowsChange: (rowKeys) => {
            setExpandedRowKeys(rowKeys);
          },
        }}
      />
      <NewAndEditForm
        onSave={saveHandle}
        onCancel={cancelHandle}
        visible={createVisible}
        parentId={parentId}
        editData={editData}
      />
    </div>
  );
};

export default MenuPage