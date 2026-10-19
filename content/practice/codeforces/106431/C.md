---
title: "CF 106431C - 树之道（搜索树）"
description: "该问题要求我们在执行命令序列时维护二叉搜索树。 树一开始是空的。"
date: "2026-06-25T09:38:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106431
codeforces_index: "C"
codeforces_contest_name: "Entrenamiento OIE Nivel Experto - Semana 12"
rating: 0
weight: 106431
solve_time_s: 37
verified: true
draft: false
---

[CF 106431C - 树之道（搜索树）](https://codeforces.com/problemset/problem/106431/C)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们在执行命令序列时维护二叉搜索树。 树一开始是空的。 插入命令根据正常的二叉搜索树规则将新键放置到正确的叶位置，而如果键已经存在则忽略该操作。 删除命令使用标准 BST 删除规则删除键（如果存在）：用其有序前驱替换具有两个子节点的节点。 打印命令要求我们使用递归括号表示输出当前树。 

输入是操作流而不是单个静态树。 每个操作都会更改后续操作观察到的结构。 每次打印请求后，输出都是树的确切形状，因此仅存储键集是不够的。 父母和孩子的关系必须保持。 

约束是围绕模拟设计的。 操作的数量可能足够大，以至于在每个命令之后重建整个树将是浪费的。 如果有大约 100000 个操作，则在最坏的情况下扫描所有现有节点以查找每个操作的方法可以达到大约 10^10 个操作，这远远超出了典型的一秒限制。 预期的方法是使每个树修改与树的当前高度成比例。 二叉搜索树可以成为一条链，因此最坏情况的高度是 O(n)，但命令总数是真正的限制因素，我们需要避免额外的完全遍历。 

棘手的情况主要是删除和打印。 例如，删除叶子必须精确删除该节点。```
ADD 5
ADD 3
DEL 3
PRINT
```输出是：```
5
```一个粗心的实现，仅将节点标记为已删除，但不断开父指针的连接，仍然可以打印旧的子节点。 

删除具有两个子节点的节点是另一个常见错误。```
ADD 5
ADD 3
ADD 7
ADD 4
DEL 5
PRINT
```正确的输出是：```
4(3,7)
```5 的前任是 4，因此 4 替换 5。选择后继的实现将创建一棵不同的树。 

空树也是可能的。```
DEL 10
PRINT
```输出是：```

```删除操作不会执行任何操作，因为该密钥不存在。 打印空树应该产生空行，而不是特殊标记。 

## 方法

 直接的解决方案是用其键和指向左子节点和右子节点的指针来表示每个节点。 对于插入，我们从根开始，反复将新键与当前节点进行比较，直到找到空的子位置。 这正是 BST 的定义方式，因此该过程是正确的。 对于删除，我们搜索节点，然后处理三种情况：没有子节点、一个子节点或两个子节点。 打印只是遵循所需格式的递归遍历。 

强力方法是将所有键存储在一个数组中，并在命令更改时重建树。 这仍然是正确的，因为以相同的顺序插入相同的密钥会重建相同的 BST。 然而，在每个命令之后重建都会花费 O(n) 的工作量。 如果执行多达 100000 次操作，这可能会变成大约 O(n²)，这太慢了。 

关键的观察是 BST 操作只需要检查从根到受影响密钥的路径。 树的其余部分已经处于有效状态，不需要进行修改。 节点删除也仅更改已删除节点周围的少量链接。 这减少了每次更新的高度遍历。 

剩下的问题是打印。 打印命令必须访问每个节点，因为必须输出整个结构。 该成本是不可避免的，因为输出本身包含整个树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况下的 O(q²) | O(n) | 太慢了|
 | 最佳 | O(qh + 打印节点总数) | O(n) | 已接受 |

 这里 q 是命令的数量，h 是当前树的高度。 

## 算法演练

 1. 使用包含键及其左子节点和右子节点的引用的节点存储树。 保留对根节点的引用。 树结构本身就是我们以后操作所需要的信息。 
2. 对于 ADD 操作，从根开始并将新密钥与每个访问的节点进行比较。 向左移动可获得较小的键，向右移动可获得较大的键。 当下一个子指针为空时，将新节点附加到那里。 如果在搜索过程中找到该键，则停止，因为重复项将被忽略。 
3. 对于DEL操作，在记住父节点的同时搜索目标键。 如果钥匙丢失，请立即返回。 如果该节点没有子节点，则删除相应的父节点指针。 如果它有一个子项，请将父项直接连接到该子项。 
4. 如果删除的节点有两个子节点，则在其左子树中查找最右边的节点。 该节点是小于已删除键的最大键，因此用它替换已删除节点可以保持 BST 排序有效。 将前任节点从原来的位置移除并重新连接子节点。 
5. 对于 PRINT 操作，递归地生成表示。 丢失的节点会贡献一个空字符串。 叶子只贡献它的密钥。 任何其他节点都会贡献其密钥，然后提供其子节点的表示。 

为什么它有效：不变量是每次修改后，每个节点仍然满足二叉搜索树排序规则。 插入会保留它，因为新节点恰好放置在第一个有效的空位置。 删除会保留它，因为用其有序前驱替换两个子节点会使所有左子树值更小，所有右子树值更大。 由于打印仅读取维护的结构，因此输出始终描述当前树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 25)

class Node:
    __slots__ = ("key", "left", "right")
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

root = None

def add(key):
    global root
    if root is None:
        root = Node(key)
        return

    cur = root
    while True:
        if key == cur.key:
            return
        if key < cur.key:
            if cur.left is None:
                cur.left = Node(key)
                return
            cur = cur.left
        else:
            if cur.right is None:
                cur.right = Node(key)
                return
            cur = cur.right

def delete(key):
    global root
    parent = None
    cur = root

    while cur is not None and cur.key != key:
        parent = cur
        if key < cur.key:
            cur = cur.left
        else:
            cur = cur.right

    if cur is None:
        return

    if cur.left is None:
        child = cur.right
        if parent is None:
            root = child
        elif parent.left is cur:
            parent.left = child
        else:
            parent.right = child
    elif cur.right is None:
        child = cur.left
        if parent is None:
            root = child
        elif parent.left is cur:
            parent.left = child
        else:
            parent.right = child
    else:
        pred_parent = cur
        pred = cur.left
        while pred.right is not None:
            pred_parent = pred
            pred = pred.right

        cur.key = pred.key

        if pred_parent.left is pred:
            pred_parent.left = pred.left
        else:
            pred_parent.right = pred.left

def build(cur):
    if cur is None:
        return ""
    if cur.left is None and cur.right is None:
        return str(cur.key)
    return str(cur.key) + "(" + build(cur.left) + "," + build(cur.right) + ")"

def solve(data):
    global root
    root = None
    ans = []

    for line in data.splitlines():
        if not line:
            continue
        parts = line.split()
        if parts[0] == "ADD":
            add(int(parts[1]))
        elif parts[0] == "DEL":
            delete(int(parts[1]))
        else:
            ans.append(build(root))

    return "\n".join(ans)

data = sys.stdin.read()
print(solve(data))
```这`Node`类仅存储 BST 所需的三条信息。 当树变成链时，使用迭代插入和删除可以避免递归深度问题。 

插入例程沿着树向下走，直到找到丢失的指针。 相等性检查在移动之前完成，这可以防止插入重复的键。 

删除是最微妙的部分。 搜索保留父节点，因为更改树需要修改指向已删除节点的指针。 在两个孩子的情况下，通过向左移动一次然后尽可能向右移动来找到前驱。 前驱不能有右子节点，因此将其键复制到已删除节点后，可以像零或一个子节点情况一样将其删除。 

打印函数是递归的，因为请求的格式自然是递归的。 空字符串处理允许非叶节点内丢失的子节点正确显示，例如`5(3,)`。 

## 工作示例

 考虑这个序列：```
ADD 5
ADD 3
ADD 7
PRINT
DEL 5
PRINT
```执行状态为：

 | 步骤| 运营| 根| 印刷树|
 | --- | --- | --- | --- |
 | 1 | 添加 5 | 5 | |
 | 2 | 添加 3 | 5 | |
 | 3 | 添加 7 | 5 | |
 | 4 | 打印 | 5 | 5(3,7) | 5(3,7) |
 | 5 | 删除 5 | 7 | |
 | 6 | 打印 | 7 | 3(,7) | 3(,7) |

 删除操作将 5 替换为其前身 3。子树排序仍然有效，因为 3 左边的所有内容都较小，而 3 右边的所有内容都较大。 

第二个例子：```
ADD 8
ADD 2
ADD 4
ADD 10
DEL 2
PRINT
DEL 100
PRINT
```| 步骤| 运营| 根| 印刷树|
 | --- | --- | --- | --- |
 | 1 | 添加 8 | 8 | |
 | 2 | 添加 2 | 8 | |
 | 3 | 添加 4 | 8 | |
 | 4 | 添加 10 | 8 | |
 | 5 | 删除 2 | 8 | |
 | 6 | 打印 | 8 | 8(4,10) | 8(4,10) |
 | 7 | 删除 100 | 8 | |
 | 8 | 打印 | 8 | 8(4,10) | 8(4,10) |

 第二次删除没有效果，因为密钥不存在。 跟踪确认无效操作使树保持不变。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(qh + P) | 每次更新都遵循从根到叶的路径。 打印成本 P，即所有打印命令写入的节点数。 |
 | 空间| O(n) | 每个现有密钥占用一个节点。 |

 该解决方案符合约束条件，因为它从不重建树。 当输出明确需要整个结构时，才会发生唯一的完整遍历。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    return solve(inp).strip()

assert run("""ADD 5
ADD 3
ADD 7
PRINT
""") == "5(3,7)", "basic insert"

assert run("""ADD 5
ADD 3
ADD 7
DEL 5
PRINT
""") == "3(,7)", "delete root with two children"

assert run("""PRINT
DEL 1
PRINT
""") == "", "empty tree"

assert run("""ADD 1
ADD 2
ADD 3
DEL 2
PRINT
""") == "1(,3)", "delete node with one child"

assert run("""ADD 10
ADD 5
ADD 15
ADD 12
DEL 100
PRINT
""") == "10(5,15(12,))", "delete missing key"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三节点插入 |`5(3,7)`| 基本 BST 构建 |
 | 删除根 |`3(,7)`| 二胎删除|
 | 打印空树 | 空行| 空表示 |
 | 删除链节点 |`1(,3)`| 一孩置换 |
 | 删除缺失值 |`10(5,15(12,))`| 忽略无效操作 |

 ## 边缘情况

 对于空树情况，输入```
DEL 10
PRINT
```从无根开始。 删除搜索立即失败，因此根仍为空。 打印在丢失的节点上调用递归函数并返回空字符串。 

对于两个子项删除，请考虑：```
ADD 6
ADD 2
ADD 9
ADD 4
DEL 6
PRINT
```节点 6 两侧都有子节点。 该算法找到 4 作为左子树的最右边节点，将其密钥复制到根中，并删除旧的 4 位置。 输出变为：```
4(2,9)
```简单地删除 6 的解决方案将丢失两棵子树。 

对于重复插入，请考虑：```
ADD 5
ADD 5
PRINT
```第二次插入到达键为 5 的现有节点并停止。 树仍然存在：```
5
```这很重要，因为插入重复项会打破删除逻辑所依赖的每个键都出现一次的假设。
