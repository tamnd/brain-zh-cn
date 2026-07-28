---
title: "CF 102787Z - 不捣蛋"
description: "该问题维护了trap节点的有序组的集合。 节点是用一个值创建的，其标识符是创建它的查询号。"
date: "2026-07-27T19:19:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102787
codeforces_index: "Z"
codeforces_contest_name: "Algorithms Thread Treaps Contest"
rating: 0
weight: 102787
solve_time_s: 63
verified: true
draft: false
---

[CF 102787Z - 捣蛋](https://codeforces.com/problemset/problem/102787/Z)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题维护了trap节点的有序组的集合。 节点是用一个值创建的，其标识符是创建它的查询号。 组的行为类似于序列：当两个组连接时，包含一个节点的整个组被放置在包含另一个节点的整个组之前。 还可以在给定数量的节点之后切割组，将其前缀与后缀分开。 查询要求包含特定节点的组内所有值的总和。 

输入是最多的流$5 \cdot 10^5$运营。 由于每个操作都必须在线处理，因此不可能重建组或扫描其内容。 在每次合并、拆分或查询期间触及每个节点的解决方案可以达到$O(q^2)$，这远远超出了 8 秒限制所能处理的范围。 我们需要每个操作都以对数时间进行。 

棘手的情况来自节点标识符不描述位置的事实。 合并和分裂后，节点可以在其组内的任何位置移动。 

例如，之后：```
5
1 10
1 20
2 1 2
4 1
4 2
```输出是：```
30
30
```只记住每个节点的原始组的粗心解决方案将会失败，因为节点 1 和 2 成为同一有序序列的一部分。 

另一种边缘情况是分割包含查询节点的组，但将该节点留在剪切的两侧。 

例如：```
4
1 5
1 7
2 1 2
3 2 1
4 2
```输出是：```
7
```分割之前的顺序是`[1, 2]`。 第一个节点创建后分裂`[1]`和`[2]`。 节点 2 不再位于第一组中，因此仅存储旧根会给出错误的答案。 

最终的边界情况是在组末尾附近分裂：```
3
1 8
3 1 1
4 1
```输出是：```
8
```拆分不会执行任何操作，因为该组只有一个节点。 假设两个结果部分都存在的实现可能会损坏父指针。 

## 方法

 一种直接的方法是将每个组存储为列表。 创建节点很容易，查询组意味着对其列表求和。 当操作移动整个组或拆分它们时，就会出现问题。 合并两个大组需要复制或链接许多元素，而拆分则需要走到剪切位置。 在最坏的情况下，$5 \cdot 10^5$操作可以每次触摸$5 \cdot 10^5$节点，给出关于$2.5 \cdot 10^{11}$运营。 

操作的结构给出了关键的观察结果。 组不是任意的集合，它们是有序的序列。 所需的操作正是隐式trap支持的操作：连接两个序列、按位置分割序列以及维护聚合信息（例如值的总和）。 

剩下的挑战是回答哪个序列包含给定节点。 每个trap节点都存储一个父指针。 跟随父指针到达其组的当前根。 因为平均陷阱高度是对数的，所以找到该组也是对数的。 

蛮力之所以有效，是因为它直接对组进行建模，但会失败，因为它忽略了组是动态序列。 每个操作都是一个序列操作的观察结果让我们可以用隐式陷阱来表示每个组，并保持所有操作的快速。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(q^2)$|$O(q)$| 太慢了 |
 | 最佳 |$O(q \log q)$预计|$O(q)$| 已接受 |

 ## 算法演练

 1. 当出现创建查询时，创建一个隐式trap节点。 它的值是给定值，它的大小是 1，它的总和是该值。 存储其索引，以便将来的查询可以直接访问该节点。 
2. 对于合并查询，找到两个引用节点的根。 如果他们已经陷入同一个陷阱，那么什么都不会改变。 否则，合并两个树根，将第一个根放在第二个根之前。 隐式trap合并操作保留序列顺序，同时保持树平衡。 
3. 对于分割查询，找到引用节点的根。 在第一个陷阱之后分裂那个陷阱$z$节点。 得到的两个陷阱代表前缀组和后缀组。 节点本身可能会出现在任一部分，这就是为什么我们必须依赖父指针而不是存储的组标识符。 
4. 对于求和查询，从引用的节点通过父指针向上爬，直到到达组根。 根存储其整个陷阱的总和，因此该值就是答案。 

为什么它有效：

 不变的是，每个treap恰好代表一个当前组，并且treap的中序遍历是该组内节点的顺序。 合并使有序序列等于两个组的串联。 分割在请求的位置划分有序序列，因此两个结果组都包含完全正确的节点。 每次结构变化后都会更新存储的子树总和，使根总和等于整个组的总和。 父指针始终将每个节点连接到其trap的当前根，因此节点查询始终到达正确的组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import random
sys.setrecursionlimit(1 << 25)

left = [0]
right = [0]
parent = [0]
size = [0]
total = [0]
value = [0]
priority = [0]

def pull(x):
    if x:
        size[x] = size[left[x]] + size[right[x]] + 1
        total[x] = total[left[x]] + total[right[x]] + value[x]

def merge(a, b):
    if not a:
        if b:
            parent[b] = 0
        return b
    if not b:
        parent[a] = 0
        return a
    if priority[a] > priority[b]:
        right[a] = merge(right[a], b)
        if right[a]:
            parent[right[a]] = a
        pull(a)
        parent[a] = 0
        return a
    else:
        left[b] = merge(a, left[b])
        if left[b]:
            parent[left[b]] = b
        pull(b)
        parent[b] = 0
        return b

def split(t, k):
    if not t:
        return 0, 0
    if size[left[t]] >= k:
        a, b = split(left[t], k)
        left[t] = b
        if b:
            parent[b] = t
        pull(t)
        parent[t] = 0
        if a:
            parent[a] = 0
        return a, t
    else:
        a, b = split(right[t], k - size[left[t]] - 1)
        right[t] = a
        if a:
            parent[a] = t
        pull(t)
        parent[t] = 0
        if b:
            parent[b] = 0
        return t, b

def root_of(x):
    while parent[x]:
        x = parent[x]
    return x

def new_node(v):
    idx = len(value)
    left.append(0)
    right.append(0)
    parent.append(0)
    size.append(1)
    total.append(v)
    value.append(v)
    priority.append(random.randrange(1 << 60))
    return idx

def solve():
    q = int(input())
    ans = []
    nodes = [0] * (q + 1)

    for i in range(1, q + 1):
        query = list(map(int, input().split()))
        t = query[0]

        if t == 1:
            nodes[i] = new_node(query[1])

        elif t == 2:
            y, z = query[1], query[2]
            a = root_of(nodes[y])
            b = root_of(nodes[z])
            if a != b:
                merge(a, b)

        elif t == 3:
            y, z = query[1], query[2]
            r = root_of(nodes[y])
            if size[r] > z:
                split(r, z)

        else:
            y = query[1]
            ans.append(str(total[root_of(nodes[y])]))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```数组代表trap节点的字段。 使用数组代替 Python 对象可以减少内存开销，因为最大节点数为$5 \cdot 10^5$。`merge`和`split`是标准的隐式trap操作。 每次指针改变后，`pull`重新计算子树大小和总和。 父指针在这些操作期间会更新，因为稍后在查找节点的当前组时需要它们。 

这`root_of`函数不需要路径压缩。 陷阱高度预计将保持对数关系，因为优先级是随机的，因此向上行走足够快。 

分割条件使用`size[left[t]]`因为隐式陷阱根据左子树的大小决定位置。 这可以避免分离第一个时出现任何差一错误$z$节点。 

## 工作示例

 使用示例输入：```
10
1 38788
3 1 1
3 1 2
1 56200
3 1 2
3 1 2
4 4
3 4 4
4 1
3 4 6
```| 步骤| 运营| 包含节点 4 | 的组 总和|
 | --- | --- | --- | --- |
 | 1 | 使用 38788 创建节点 1 | [1] | 38788 |
 | 2 | 1 后分割 | [1] | 38788 |
 | 3 | 2 后分裂 | [1] | 38788 |
 | 4 | 使用 56200 创建节点 4 | [4] | 56200 |
 | 5 | 2 后分裂 | [4] | 56200 |
 | 6 | 2 后分裂 | [4] | 56200 |
 | 7 | 查询节点4 | [4] | 56200 |

 第一个跟踪显示，拆分单节点组会使该组保持不变。 

第二个例子：```
5
1 10
1 20
2 1 2
4 1
4 2
```| 步骤| 运营| 序列 | 总和|
 | --- | --- | --- | --- |
 | 1 | 创建节点1 | [10]| 10 | 10
 | 2 | 创建节点 2 | [20]| 20 |
 | 3 | 将节点 1 组合并到节点 2 组之前 | [10,20]| 30|
 | 4 | 查询节点1| [10,20]| 30|
 | 5 | 查询节点2| [10,20]| 30|

 这表明节点在周围序列发生变化时仍保持其身份。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \log q)$预计| 每个操作执行恒定数量的trap合并、拆分或根搜索。 |
 | 空间|$O(q)$| 为每个创建查询创建一个trap节点。 |

 最大的输入包含五十万个操作。 每个treap操作的对数预期成本使总工作量保持在数百万次递归调用左右，这完全符合内存和时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = old_out
    sys.stdin = old
    return out.getvalue()

assert run("""10
1 38788
3 1 1
3 1 2
1 56200
3 1 2
3 1 2
4 4
3 4 4
4 1
3 4 6
""") == "56200\n38788\n"

assert run("""5
1 10
1 20
2 1 2
4 1
4 2
""") == "30\n30\n"

assert run("""1
1 5
""") == ""

assert run("""6
1 1
1 1
1 1
2 1 2
2 2 3
4 1
""") == "3\n"

assert run("""5
1 8
1 9
2 1 2
3 1 1
4 1
""") == "8\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单人创作| 无输出 | 最小尺寸输入 |
 | 两个合并节点| 30| 基本合并和查询 |
 | 三个相等的值| 3 | 重复相等的值 |
 | 合并后拆分| 8 | 边界分裂行为 |

 ## 边缘情况

 对于合并身份问题：```
5
1 10
1 20
2 1 2
4 1
4 2
```该算法在创建时单独存储节点，然后合并操作创建一个包含两个节点的树。 两个父链现在都到达相同的根，因此两个查询都返回组合总和。 

对于围绕查询节点进行分割：```
4
1 5
1 7
2 1 2
3 2 1
4 2
```陷阱序列`[5,7]`被分成`[5]`和`[7]`。 节点 2 成为第二个 Treap 的根，因此其根和为 7。父遍历找到新的根，而不是使用过时的信息。 

对于无法分离任何东西的分割：```
3
1 8
3 1 1
4 1
```该算法在分割之前检查组大小。 由于大小不大于请求的前缀长度，因此该操作不会影响trap，并且查询仍然会看到 sum 8。
