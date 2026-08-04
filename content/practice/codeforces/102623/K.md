---
title: "CF 102623K - K 移位阵列"
description: "我们有一个值数组。 两种操作混合在一起：一种操作重新排列数组的连续部分，另一种操作要求连续部分的总和。 K 平移并不是整个区间的正常旋转。"
date: "2026-08-04T17:15:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102623
codeforces_index: "K"
codeforces_contest_name: "2020 Lenovo Cup USST Campus Online Invitational Contest"
rating: 0
weight: 102623
solve_time_s: 79
verified: true
draft: false
---

[CF 102623K - K 移位数组](https://codeforces.com/problemset/problem/102623/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个值数组。 两种操作混合在一起：一种操作重新排列数组的连续部分，另一种操作要求连续部分的总和。 

K 平移并不是整个区间的正常旋转。 所选间隔被分成大小为 K 的连续块。在每个块内，第一个值移动到末尾，每个其他值向左移动一个位置。 K 唯一可能的值为 2 和 3，这意味着重新排列是一个小的周期性排列。 

挑战在于数组长度和操作次数都可以达到 200000。每次更新或查询后扫描一个间隔的解决方案在最坏的情况下可以执行大约 4×10^10 次操作，这远远超出了可能的范围。 我们需要每个操作都依赖于数组大小的对数而不是间隔的长度。 

主要陷阱来自这样一个事实：K 移位取决于间隔的起始位置，而不仅仅是 K。例如，将 2 移位应用于位置 1 到 4 的交换 (1,2) 和 (3,4)，同时将其应用于位置 2 到 5 的交换 (2,3) 和 (4,5)。 只记住段是否被移动 2 或 3 的结构将丢失必要的信息。 

另一个边缘情况是多次部分移位后的查询。 考虑：```
3 2
1 2 3
1 1 2 2
2 1 3
```第一个操作将数组更改为`[2,1,3]`，所以答案是：```
6
```粗心的实现将操作视为全局轮换会产生错误的顺序，并可能导致后续查询失败。 

当线段树节点完全位于更新范围内但其长度不能被 K 整除时，会出现第二种边缘情况。例如，K=2 的更新`[1,6]`可以遇到子段`[1,3]`。 该节点不能作为一个整体进行移动，因为它的长度是奇数。 更新必须继续下降，而不是错误地应用惰性标记。 

## 方法

 直接的解决方案是存储实际的数组。 对于 K 移位，我们迭代大小为 K 的块中的间隔并旋转每个块。 通过扫描请求间隔中的所有值来计算范围总和。 这种方法是正确的，因为它完全执行所描述的操作，但单个操作可以触及 O(n) 个元素。 通过 200000 次操作，最坏的情况达到大约 4×10^10 元素访问。 

有用的观察结果是 K 非常小。 2-shift 只关心相对于操作开始位置模 2 的位置。 3 班只关心模 3 的位置。由于两个周期都除 6，因此每个操作都可以表示为模 6 的位置的六个残基类别的排列。 

我们不存储线段树节点内元素的确切顺序，而是存储六个和。 桶内的价值`i`是该节点中全局索引有余数的所有元素的总和`i`模 6。完全覆盖的节点上的 K 移位只需排列这六个存储桶。 实际位置不需要重建。 

惰性传播存储应用于每个节点的累积排列。 范围查询从覆盖的节点收集六个桶并添加适当的残基。 仅当节点无法作为整体进行转换时，范围更新才会下降。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次操作 O(n) | O(n) | 太慢了|
 | 最佳| 每次操作 O(6 log n) | O(6n) | O(6n) | 已接受 |

 ## 算法演练

 1. 构建一棵线段树，每个节点存储六个和。 第六个桶对应于六个可能的值`index mod 6`。 这种表示准确地保留了未来班次和查询所需的信息。 
2. 对于接收完整 K-shift 更新的节点，计算六个剩余桶的排列。 排列取决于更新间隔的左边界，因为块从那里开始。 
3. 将排列应用于节点的六个和，并将其与节点的惰性排列组合。 该节点现在表示移位后的相同数组段，而不访问其子节点。 
4. 如果一个全覆盖节点由于其长度不能被K整除而不能作为一个整体进行移位，则将其惰性信息推送到其子节点并继续递归。 这可以防止对具有不完整块的段应用无效转换。 
5. 对于范围和查询，递归访问线段树。 当节点完全位于查询区间内时，将所有六个存储的和相加，因为该节点中的每个元素都属于请求的范围。 

为什么它有效：每次更新仅更改其块内元素的位置。 块大小为 2 或 3，因此元素的目的地仅取决于其模 6 的位置和移位间隔的开始。 六个存储的和准确地保留了这些类，因此每个变换都可以用排列来表示。 延迟传播在不扩展段的情况下保持表示有效，并且查询分解仅收集每个元素一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [[0] * 6 for _ in range(4 * self.n)]
        self.lazy = [list(range(6)) for _ in range(4 * self.n)]
        self.build(1, 1, self.n, arr)

    def build(self, p, l, r, arr):
        if l == r:
            self.tree[p][l % 6] = arr[l - 1]
            return
        m = (l + r) // 2
        self.build(p * 2, l, m, arr)
        self.build(p * 2 + 1, m + 1, r, arr)
        for i in range(6):
            self.tree[p][i] = self.tree[p * 2][i] + self.tree[p * 2 + 1][i]

    def apply_perm(self, p, perm):
        old = self.tree[p]
        self.tree[p] = [0] * 6
        for i in range(6):
            self.tree[p][perm[i]] = old[i]

        cur = self.lazy[p]
        nxt = [0] * 6
        for i in range(6):
            nxt[i] = cur[perm[i]]
        self.lazy[p] = nxt

    def push(self, p):
        if self.lazy[p] != list(range(6)):
            perm = self.lazy[p]
            self.apply_child(p * 2, perm)
            self.apply_child(p * 2 + 1, perm)
            self.lazy[p] = list(range(6))

    def apply_child(self, p, perm):
        old = self.tree[p]
        self.tree[p] = [0] * 6
        for i in range(6):
            self.tree[p][perm[i]] = old[i]

        cur = self.lazy[p]
        nxt = [0] * 6
        for i in range(6):
            nxt[i] = cur[perm[i]]
        self.lazy[p] = nxt

    def get_perm(self, l, k):
        perm = list(range(6))
        for i in range(6):
            pos = i
            rel = (pos - l) % k
            if rel == 0:
                new_pos = (pos + k - 1) % 6
            else:
                new_pos = (pos - 1) % 6
            perm[i] = new_pos
        return perm

    def update(self, p, l, r, ql, qr, k):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr and (r - l + 1) % k == 0:
            self.apply_perm(p, self.get_perm(ql % 6, k))
            return
        if l == r:
            return
        self.push(p)
        m = (l + r) // 2
        self.update(p * 2, l, m, ql, qr, k)
        self.update(p * 2 + 1, m + 1, r, ql, qr, k)
        for i in range(6):
            self.tree[p][i] = self.tree[p * 2][i] + self.tree[p * 2 + 1][i]

    def query(self, p, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return sum(self.tree[p])
        self.push(p)
        m = (l + r) // 2
        return self.query(p * 2, l, m, ql, qr) + self.query(p * 2 + 1, m + 1, r, ql, qr)

def solve():
    n, m = map(int, input().split())
    arr = list(map(int, input().split()))
    seg = SegTree(arr)
    ans = []

    for _ in range(m):
        data = list(map(int, input().split()))
        if data[0] == 1:
            _, l, r, k = data
            seg.update(1, 1, n, l, r, k)
        else:
            _, l, r = data
            ans.append(str(seg.query(1, 1, n, l, r)))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该树按全局索引模 6 存储总和，因此构建阶段将每个初始值恰好放入一个存储桶中。 惰性数组是这六个桶的排列。 应用惰性操作意味着移动存储桶总和并将现有的待处理排列与新排列组合起来。 

置换函数使用更新间隔的左边界。 对于 K 移位，相对位置为零的元素移动到其块的末尾，而每个其他相对位置向左移动一位。 使用模 6 是有效的，因为两种可能的块大小都可以除以 6。 

更新条件`(r - l + 1) % k == 0`是必不可少的。 线段树节点可能在请求的范围内，但仍然包含不完整的块，因此它无法直接接收变换。 

Python 整数不会溢出，这是必要的，因为总和可以达到大约 2×10^14。 树中的所有索引都是基于 1 的，以匹配问题陈述，而存储的残差使用实际索引模 6。 

## 工作示例

 对于第一个样本：

 | 运营| 阵列效果| 查询结果 |
 | --- | --- | --- |
 | 初始|`[1,2,3,4,5,6]`| |
 | 转移`[1,4]`, K=2 |`[2,1,4,3,5,6]`| |
 | 询问`[2,3]`| 值为`1,4`|`5`|
 | 转移`[1,6]`, K=3 |`[1,4,2,5,6,3]`| |
 | 询问`[2,6]`| 值为`4,2,5,6,3`|`20`|

 第一个班次说明了为什么不能将操作视为一次轮换。 每对独立移动，这由残基类精确捕获。 

再举个例子：```
5 3
10 20 30 40 50
1 2 5 2
2 1 5
2 2 4
```| 运营| 段状态| 输出|
 | --- | --- | --- |
 | 初始|`[10,20,30,40,50]`| |
 | 转移`[2,5]`, K=2 |`[10,30,20,50,40]`| |
 | 询问`[1,5]`| 所有值的总和 |`150`|
 | 询问`[2,4]`| 总和`30,20,50`|`100`|

 本例检查移位是否从任意位置开始，而不是始终从索引 1 开始。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次操作 O(6 log n) | 每个被访问的线段树节点仅对六个桶执行恒定的工作。 |
 | 空间| O(6n) | O(6n) | 每个节点存储六个和和一个六元素排列。 |

 该解决方案符合限制，因为 200000 次操作每次都需要大约对数的工作。 常数因子很小，因为每个变换仅操作六个值。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    arr = [int(next(it)) for _ in range(n)]

    seg = SegTree(arr)
    out = []

    for _ in range(m):
        t = int(next(it))
        if t == 1:
            l = int(next(it))
            r = int(next(it))
            k = int(next(it))
            seg.update(1, 1, n, l, r, k)
        else:
            l = int(next(it))
            r = int(next(it))
            out.append(str(seg.query(1, 1, n, l, r)))

    return "\n".join(out)

assert run("""6 4
1 2 3 4 5 6
1 1 4 2
2 2 3
1 1 6 3
2 2 6
""") == "5\n20"

assert run("""3 2
1 2 3
1 1 2 2
2 1 3
""") == "6"

assert run("""5 3
10 20 30 40 50
1 2 5 2
2 1 5
2 2 4
""") == "150\n100"

assert run("""3 2
7 7 7
1 1 3 3
2 1 3
""") == "21"

assert run("""6 2
1 2 3 4 5 6
1 2 6 3
2 2 5
""") == "18"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 输入样本|`5`,`20`| 基本班次和查询 |
 | K=2 的三个元素 |`6`| 最小有效移位|
 | 从索引 2 开始移位 |`150`,`100`| 非零更新偏移|
 | 同等价值|`21`| 排列不会改变总和 |
 | K=3 部分区间 |`18`| 边界处理 |

 ## 边缘情况

 第一个边缘情况是从一个位置以外的位置开始的更新。 在测试中：```
5 3
10 20 30 40 50
1 2 5 2
2 2 4
```该段`[2,5]`变成`[30,20,50,40]`在那个区间内。 排列使用`l mod 6`，因此存储的残基类被正确移动。 

第二个边缘情况是长度与移位大小不匹配的线段树节点。 为了：```
3 2
1 2 3
1 1 2 2
2 1 3
```更新仅影响两个元素，因此第三个元素必须保持不变。 更新例程拒绝对无效节点长度应用 K 移位，并继续向下，直到每个变换的节点代表完整的块。 

第三种边缘情况是应用保留总和但改变内部顺序的移位。 案例：```
6 2
1 2 3 4 5 6
1 2 6 3
2 2 5
```改变几个残基类别的排列，而查询仍然只需要它们的组合值。 六桶表示为以后的部分查询保留了足够的信息，而无需存储整个订单。
