---
title: "CF 106431D - 树之道（陷阱）"
description: "任务是维护具有trap规则的二叉搜索树。 每个节点都有一个键（决定其在搜索树中的位置）和一个高度值（其作用类似于优先级）。"
date: "2026-06-25T09:39:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106431
codeforces_index: "D"
codeforces_contest_name: "Entrenamiento OIE Nivel Experto - Semana 12"
rating: 0
weight: 106431
solve_time_s: 35
verified: true
draft: false
---

[CF 106431D - 树之道（陷阱）](https://codeforces.com/problemset/problem/106431/D)

 **评级：** -
 **标签：** -
 **求解时间：** 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是维护具有trap规则的二叉搜索树。 每个节点都有一个键（决定其在搜索树中的位置）和一个高度值（其作用类似于优先级）。 较小的高度必须始终更接近根，因此每个父级的高度都小于其子级。 

输入是应用于最初为空的树的一系列命令。 插入会提供新的键和高度，并且必须将节点准确放置在trap规则要求的位置。 删除会删除一个键，同时保留剩余的结构。 打印操作使用所需的递归表示输出树，将每个节点显示为`key/height`并递归地显示其子项。 

关键的困难在于普通的二叉搜索树插入是不够的。 在叶子处添加节点可能会违反高度顺序，因此插入必须重建树的部分内容。 约束允许许多操作，键最多可达$10^5$和高度可达$10^9$。 当处理许多命令时，每次更新都要遍历每个节点的解决方案将变得二次。 我们需要每次修改只触及树的高度，预计树的高度是对数的，因为陷阱以很高的概率保持平衡。 

一些边缘情况很容易被错误处理。 

如果插入的节点具有最小的高度，则它成为根。 例如：```
ADD 5 10
ADD 3 1
PRINT
```输出是：```
3/1(,5/10)
```始终按键插入的解决方案会错误地保留`5`作为根。 

删除具有两个子节点的节点需要连接其剩余的两个边，而不是简单地删除该节点。 例如：```
ADD 2 2
ADD 1 1
ADD 3 3
DEL 2
PRINT
```正确的输出是：```
1/1(,3/3)
```不小心的删除可能会留下一棵无效的树或丢失一个子树。 

分割操作也有边界条件。 按键拆分`k`必须放置钥匙`k`其本身在左侧结果中。 如果比较从`<=`到`<`，在现有键周围插入和删除将产生不正确的树。 

## 方法

 直接的解决方案是将树存储为普通的二叉搜索树并递归地模拟每个操作。 按键搜索很容易，插入可以将节点作为叶子。 问题是叶子插入忽略了高度。 一系列随着高度增加而增加的键创建了一条链：```
1
 \
  2
   \
    3
     \
      4
```后$n$插入，单个操作可能会遍历$O(n)$节点，给定$O(n^2)$处理所有命令。 

重要的观察是高度值已经描述了节点所属的位置。 树中高度最小的节点必须是根。 所有具有较小键的节点都属于其左子树，所有具有较大键的节点都属于其右子树。 这意味着可以通过组合两个原始操作来更改trap。`split`将一个trap分成围绕一个键的两个有效trap。`join`组合两个有效的 trap，其中第一个中的每个键都小于第二个中的每个键。 这两个操作都递归地沿着一条路径移动，因为每个递归调用都会丢弃树的一侧。 由于陷阱的预期高度是对数，因此这些操作是有效的。 

插入变成围绕新键的分割，创建新的单个节点，然后将各个部分重新连接在一起。 删除变成隔离目标节点的两个分割，然后是剩余部分的一个连接。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 陷阱分割/连接 | 预期 O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 插入节点`(k, h)`，将当前陷阱分割为`k`。 左树包含小于或等于的每个键`k`，并且右侧的树包含每个较大的键。 这创建了二叉搜索树所需的正确分离。 
2. 创建一个新的trap，仅包含`(k, h)`。 将左侧部分与该节点连接，然后将结果与右侧部分连接。 连接操作使用高度选择根，因此高度条件会自动恢复。 
3. 删除密钥`k`，将树分割为`k`，生成包含最多键的左侧部分`k`右侧部分包含较大的按键。 
4. 将左侧部分分割为`k - 1`。 第二次分割将所有较小的密钥与具有密钥的单个节点分开`k`。 
5. 丢弃孤立的节点并连接剩余的两棵树。 由于左树中的每个键都小于右树中的每个键，因此结果是有效的陷阱。 
6. 打印时，递归打印当前节点。 如果缺少一个孩子，则打印一个空位置。 否则，在括号中打印子子树。 

为什么它有效：

 不变的是每个子树总是满足两个treap属性：键遵循二叉搜索树排序，高度遵循堆排序。`split`保留这一点是因为它仅在递归重建受影响的路径时更改父子关系。`join`保留它，因为根必须是两个输入树中高度最小的节点，并且递归调用在剩余的子树上继续相同的推理。 由于插入和删除仅由这些有效操作组成，因此每个中间树和最终树仍然是正确的树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("key", "height", "left", "right")

    def __init__(self, key, height):
        self.key = key
        self.height = height
        self.left = None
        self.right = None

def join(a, b):
    if a is None:
        return b
    if b is None:
        return a

    if a.height < b.height:
        a.right = join(a.right, b)
        return a
    else:
        b.left = join(a, b.left)
        return b

def split(root, key):
    if root is None:
        return None, None

    if root.key <= key:
        left_part, right_part = split(root.right, key)
        root.right = left_part
        return root, right_part
    else:
        left_part, right_part = split(root.left, key)
        root.left = right_part
        return left_part, root

def add(root, key, height):
    left, right = split(root, key)
    return join(join(left, Node(key, height)), right)

def delete(root, key):
    middle, right = split(root, key)
    left, _ = split(middle, key - 1)
    return join(left, right)

def build_string(root):
    if root is None:
        return ""

    value = f"{root.key}/{root.height}"

    if root.left is None and root.right is None:
        return value

    return value + "(" + build_string(root.left) + "," + build_string(root.right) + ")"

def solve():
    root = None
    out = []

    for line in sys.stdin:
        if not line.strip():
            continue

        cmd = line.split()

        if cmd[0] == "ADD":
            root = add(root, int(cmd[1]), int(cmd[2]))
        elif cmd[0] == "DEL":
            root = delete(root, int(cmd[1]))
        else:
            out.append(build_string(root))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`Node`类仅存储trap 属性所需的信息。 不需要父指针或额外的元数据，因为每次修改都可以递归地重建受影响的路径。`split`是核心操作。 当当前节点属于左结果时，其右子节点必须进一步拆分，因为较大的键可能仍需要移动到右结果。 对称情况处理大于分割密钥的节点。`join`比较高度，因为最小的高度必须成为根。 失败的一方递归地附加到该根的下方。 比较方向很容易意外反转，这将创建最大堆而不是所需的最小堆。 

删除用途`split(root, key)`其次是`split(left_side, key - 1)`。 由于键是整数并且是唯一的，因此这恰好隔离了一个节点。 使用`key`在第二次分割中会错误地保留被删除的节点。 

Python 整数不会溢出，因此大的高度值是安全的。 递归深度预计保持对数，因为陷阱以高概率平衡。 

## 工作示例

 考虑：```
ADD 1 23
ADD 2 19
ADD 4 95
ADD 6 13
```状态变化如下：

 | 运营| 根| 左子树| 右子树 |
 | --- | --- | --- | --- |
 | 添加 1 23 | 1/23 | 1/23 空 | 空 |
 | 添加 2 19 | 2/19 | 2/19 1/23 | 1/23 空 |
 | 添加 4 95 | 2/19 | 2/19 1/23 | 1/23 4/95 | 4/95
 | 添加 6 13 | 6/13 | 2/19 | 2/19 空 |

 最后插入位置`6`位于根部，因为它的高度最小。 前一个根成为左子树的一部分，因为所有较小的键必须保留在该侧。 

另一个例子：```
ADD 1 74
ADD 2 23
ADD 3 91
ADD 4 43
DEL 2
```| 运营| 根| 重要变化|
 | --- | --- | --- |
 | 添加 1 74 | 1/74 | 1/74 初始节点|
 | 添加 2 23 | 2/23 | 2/23 新的较小高度成为根 |
 | 添加 3 91 | 2/23 | 2/23 添加到右侧 |
 | 添加 4 43 | 2/23 | 2/23 身高 43 移动到 3/91 以上 |
 | 删除 2 | 4/43 | 4/43 左右部分连接|

 这表明删除并不会任意替换节点。 连接操作重建满足两个排序规则的唯一trap。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期 O(q log n) | 每个分割和连接都遵循一条trap路径，并且每个命令使用恒定数量的trap路径。 |
 | 空间| O(n) | 每个节点存储一次，并使用预期的对数堆栈空间进行递归。 |

 这些约束要求避免线性扫描。 treaps 的预期对数行为使得每个命令对于输入大小都足够有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().splitlines()
    sys.stdin = old

    root = None
    ans = []

    for line in data:
        cmd = line.split()
        if not cmd:
            continue
        if cmd[0] == "ADD":
            root = add(root, int(cmd[1]), int(cmd[2]))
        elif cmd[0] == "DEL":
            root = delete(root, int(cmd[1]))
        else:
            ans.append(build_string(root))

    return "\n".join(ans)

assert run("""ADD 1 23
PRINT
ADD 2 19
PRINT
""") == """1/23
2/19(1/23,)"""

assert run("""ADD 1 1
ADD 2 2
ADD 3 3
ADD 4 4
ADD 5 5
PRINT
""") == "1/1(,2/2(,3/3(,4/4(,5/5))))"

assert run("""ADD 5 10
ADD 3 1
PRINT
""") == "3/1(,5/10)"

assert run("""ADD 2 2
ADD 1 1
ADD 3 3
DEL 2
PRINT
""") == "1/1(,3/3)"

assert run("""PRINT
""") == ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 两个渐增的插入物|`2/19(1/23,)`| 按高度替换根 |
 | 增加按键和高度 | 链状陷阱| 分割和合并边界行为​​ |
 | 新的最低高度 |`3/1(,5/10)`| 插入新根|
 | 删除有两个孩子的 root |`1/1(,3/3)`| 通过连接正确删除 |
 | 空打印 | 空输出 | 空树处理|

 ## 边缘情况

 当新节点具有最小高度时，每个现有节点都必须移动到其下方。 对于输入：```
ADD 5 10
ADD 3 1
PRINT
```第一次分割将旧树与新关键位置分开。 新节点有高度`1`， 所以`join`使其成为根。 输出是：```
3/1(,5/10)
```当删除具有两个子节点的节点时，剩余的两边都必须存活。 为了：```
ADD 2 2
ADD 1 1
ADD 3 3
DEL 2
PRINT
```第一个分割将根部和右侧隔离开。 第二次分割将左孩子分开。 连接剩余的树会创建：```
1/1(,3/3)
```该算法从不手动选择替换，因此可以避免破坏高度顺序。 

一个常见的差一错误是删除过程中的第二次分割。 命令：```
DEL 2
```必须仅删除密钥`2`，并非所有键都达到`2`。 第二次分割使用`key - 1`，将每个较小的键保留在左树中并单独隔离目标节点。 这会保留所有键并保持最终连接有效。
