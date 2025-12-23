import CommonConstant from "@/model/constant/CommonConstant";

interface IFlatTree {
  children?: any[];
}

// 扁平化树结构，备注：hasParentFlag：是否需要父节点，checkFun：return true的节点，才需要添加
export function FlatTree<T extends IFlatTree>(
  data?: T[],
  hasParentFlag: boolean = true,
  filterFun?: (item: T) => boolean,
  childrenName: string = "children"
) {
  let resultList: T[] = [];

  if (!data) {
    return resultList;
  }

  data.forEach(item => {
    let flag = true;

    if (filterFun) {
      flag = filterFun(item); // 过滤不要的节点
    }

    if (flag) {
      const hasChildren = item[childrenName] && item[childrenName].length;

      if (hasChildren) {
        if (hasParentFlag) {
          resultList.push(
            JSON.parse(JSON.stringify({ ...item, [childrenName]: null }))
          ); // 添加
        }

        // 组装数据
        resultList = resultList.concat(
          FlatTree(item[childrenName], hasParentFlag, filterFun)
        );
      } else {
        resultList.push(
          JSON.parse(JSON.stringify({ ...item, [childrenName]: null }))
        ); // 添加
      }
    }
  });

  return resultList;
}

// 获取树结构，所有 有子节点的 id集合
export function GetIdListForHasChildrenNode(
  data: any[],
  idField = "id",
  childrenName: string = "children"
) {
  let resultList: string[] = [];

  data.forEach(item => {
    if (item[childrenName] && item[childrenName].length) {
      resultList.push(item[idField]);
      resultList = resultList.concat(
        GetIdListForHasChildrenNode(item[childrenName])
      );
    }
  });

  return resultList;
}

// childrenFlag：true：children始终为 [] false：children为空时，无 children属性
export function ListToTree(
  list: any[],
  pid: string | number = "0",
  childrenFlag: boolean = false,
  childrenName: string = "children",
  pidName: string = "pid",
  idName: string = "id"
) {
  const resultList: any[] = []; // 本方法返回值
  const listMap = new Map<string | number, any>(); // 把 list的所有元素转换为：id -> 元素，格式

  list.forEach(item => {
    let mapDTO = listMap.get(item[idName]);

    if (mapDTO) {
      // 如果存在 当前元素，则补充其他属性
      mapDTO = { ...item, ...mapDTO };
    } else {
      mapDTO = item;

      if (!mapDTO![childrenName]) {
        // 避免：mapDTO里面原来就有 children

        // 如果 item不存在 children
        if (childrenFlag) {
          mapDTO![childrenName] = [];
        } else {
          // mapDTO![childrenName] = null;
        }
      }
    }

    listMap.set(mapDTO[idName], mapDTO);

    if (mapDTO[pidName] === pid) {
      resultList.push(mapDTO); // 添加到返回值里
      return;
    }

    // 把自己添加到：父节点的 children上
    const parentDTO = listMap.get(mapDTO[pidName]);

    if (parentDTO) {
      if (parentDTO[childrenName]) {
        parentDTO[childrenName].push(mapDTO);
      } else {
        parentDTO[childrenName] = [mapDTO];
      }
    } else {
      listMap.set(mapDTO[pidName], { [childrenName]: [mapDTO] });
    }
  });

  // 如果，顶层的节点不是 0，则需要找到顶层节点的 id
  ListToTreeHandleResultList(resultList, listMap, pidName, idName);

  return resultList;
}

// 如果，顶层的节点不是 0，则需要找到顶层节点的 id
function ListToTreeHandleResultList(
  resultList: any[],
  listMap: Map<string | number, any>,
  pidName: string = "pid",
  idName: string = "id"
) {
  if (listMap.size === 0 || resultList.length !== 0) {
    return;
  }

  listMap.forEach(value => {
    if (!value[pidName]) {
      // 如果不存在，父级 id，则不处理
      return;
    }

    // 如果：不存在该父节点，则表示是：顶层节点
    if (!listMap.get(value[pidName])![idName]) {
      resultList.push(value); // 添加：顶层节点
    }
  });
}

interface ICalcOrderNoForm {
  orderNo?: number;
}

interface ICalcOrderNoRecord {
  children?: ICalcOrderNoForm[];
}

// 计算 orderNo
export function CalcOrderNo<
  T extends ICalcOrderNoForm,
  D extends ICalcOrderNoRecord
>(
  form: T,
  record: D,
  calcFun?: ({ item, form, record }: { item: T; form: T; record: D }) => void
) {
  if (record.children && record.children.length) {
    let orderNo = Number(record.children[0].orderNo) - 100; // 默认为第一个子节点元素减去 100

    form.orderNo = orderNo < 0 ? 0 : orderNo;

    // 如果存在子节点，那么取最小的 orderNo - 100，如果 减完之后小于零，则为 0
    record.children.forEach(item => {
      if (calcFun) {
        calcFun({ item: item as T, form, record }); // 计算其他属性
      }

      // orderNo <= 0 的不进行计算
      if (
        item.orderNo &&
        form.orderNo &&
        item.orderNo > 0 &&
        item.orderNo <= form.orderNo
      ) {
        orderNo = item.orderNo - 100;
        form.orderNo = orderNo < 0 ? 0 : orderNo;
      }
    });
  } else {
    if (form.orderNo === undefined || form.orderNo === null) {
      form.orderNo = CommonConstant.DEFAULT_ORDER_NO;
    }
  }
}
