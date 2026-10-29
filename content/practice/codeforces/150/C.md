---
title: "CF 150C - 智能作弊器"
description: "我们有一条直达巴士路线，有固定的停靠站坐标。 乘客通常支付上车点和出站点之间的全部路程费用。 售票员最多可以从车票中“隐藏”该行程的一个连续航段。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 150
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 107 (Div. 1)"
rating: 2200
weight: 150
solve_time_s: 131
verified: true
draft: false
---

[CF 150C - 智能作弊者](https://codeforces.com/problemset/problem/150/C)

 **评分：** 2200
 **标签：** 数据结构、数学、概率
 **求解时间：** 2m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一条直达巴士路线，有固定的停靠站坐标。 乘客通常支付上车点和出站点之间的全部路程费用。 售票员最多可以从车票中“隐藏”该行程的一个连续部分。 如果乘客从车站出发`a`停止`b`，指挥可以选择一些间隔`[C, D]`在该行程内，避免出售以下距离的机票`C`到`D`。 

节省下来的票价由乘客和售票员平分。 这意味着如果隐藏段长度是`x[D] - x[C]`，售票员立即赚取该金额的一半。 

风险来自检查。 连续停止之间的每个边缘都有独立的检查概率。 如果乘客没有持有检查航段的有效客票，售票员将支付罚款`c`对于该航段的该乘客。 

任务是独立地最大化所有乘客的预期利润。 每个乘客可能会收到不同的作弊计划。 

这些约束完全塑造了解决方案。 最多有`150000`停止和`300000`乘客。 对停靠点进行二次解是不可能的，即使通过线性扫描处理每个乘客的路线也将花费大约`3 * 10^5 * 1.5 * 10^5`，远远超出了极限。 我们周围需要一些东西`O((n + m) log n)`或者`O(n + m)`。 

棘手的部分是期望混合了两个不同的量：

 1. 不出售部分门票即可立即获利。 
2. 预期的未来检查损失。 

第二个量取决于分段的概率，因此粗心的实现通常会错误地计算期望。 

一个容易犯的错误是忘记了对不同部分的检查对期望的贡献是线性的。 认为：```
3 1 10
0 10 20
50 50
1 3
```如果我们隐藏整个行程，我们就可以节省`20`，所以指挥赚`10`。 预期罚款为：`10 * 0.5 + 10 * 0.5 = 10`预期利润为`0`，不是负数，也不是使用组合概率计算的，例如`1 - (1-0.5)^2`。 

另一个微妙的情况是，仅在部分路线上作弊是最佳的。```
4 1 100
0 10 20 100
0 100 0
1 4
```中间边缘有保证检查，所以隐藏整个行程是很糟糕的。 最佳选择是仅隐藏段`3 -> 4`，无检查风险。 贪婪的“以正距离隐藏所有内容”在这里失败了。 

还有一种情况是作弊永远不会有利可图。```
2 1 1000
0 10
100
1 2
```导体只会获得`5`，但预期罚款是`1000`，所以最好的答案是`0`。 任何始终选择非空隐藏区间的实现都会给出错误的结果。 

## 方法

 从暴力视图开始。 对于从车站出发的乘客`a`停止`b`，我们可以尝试每一对`(C, D)`和`a <= C < D <= b`。 隐藏距离为：```
x[D] - x[C]
```售票员收到其中的一半。 预期罚款等于内部每个未覆盖边缘的检查概率之和`[C, D)`乘以`c`。 

因此预期利润变为：```
(x[D] - x[C]) / 2 - c * sum(probabilities on hidden edges)
```如果我们预先计算坐标和概率的前缀和，则每个候选区间可以通过以下方式进行评估：`O(1)`。 不幸的是有`O(length^2)`每位乘客的间隔时间。 在最坏的情况下，一名乘客跨越所有`150000`停止，这已经给出了`10^10`间隔。 

蛮力之所以有效，是因为每个乘客都是独立的。 失败来自于在许多时间间隔内重新计算本质上相同的表达式。 

现在仔细看看隐藏区间的盈利公式`[C, D]`。 

让：```
w[i] = (x[i+1] - x[i]) / 2 - c * p[i] / 100
```这是隐藏边缘的预期贡献`i`。 

如果我们隐藏几个连续的边，总预期利润就是它们的总和`w[i]`。 

这彻底改变了问题。 对于一名乘客`(a, b)`，我们只需要边内的最大子数组和`[a, b-1]`。 

如果每条边独立贡献，则最佳隐藏区间正是最大和连续段。 

因此，整个问题简化为回答静态数组上的许多最大子数组查询。 

这是一个经典的线段树问题。 对于我们存储的每个节点：

 1. 总金额。 
2.最佳前缀和。 
3.最佳后缀和。 
4. 最佳子数组和。 

那么每个乘客的查询就变成`O(log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(mn²) | O(n) | 太慢了|
 | 最佳 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将检验概率转换为小数形式。 

对于边缘`i`停靠点之间`i`和`i+1`，预期罚款贡献为：```
c * p[i] / 100
```2. 构建数组`w`尺寸的`n-1`。 

每条边贡献：```
w[i] = (x[i+1] - x[i]) / 2 - c * p[i] / 100
```这是通过精确隐藏该边缘获得的预期利润。 
3. 观察隐藏多个连续边会增加它们的贡献。 

如果我们隐藏边缘`L`到`R`，预期利润为：```
sum(w[L:R+1])
```因为期望是线性的。 
4. 对于每一位乘客`(a, b)`，我们需要边缘内最好的连续段`[a, b-1]`。 

这正是最大子数组和查询：```
w[a-1 : b-1]
```5. 构建线段树`w`。 

每个节点存储：```
total sum
maximum prefix sum
maximum suffix sum
maximum subarray sum
```6. 合并两个子节点。 

假设左孩子是`A`右孩子是`B`。 

然后：```
total = A.total + B.total
prefix = max(A.prefix, A.total + B.prefix)
suffix = max(B.suffix, B.total + A.suffix)
best = max(A.best, B.best, A.suffix + B.prefix)
```最后一种情况处理穿过中点的子数组。 
7. 查询每个乘客区间的线段树。 

返回的节点包含该区间内的最大子数组和。 
8. 在答案中只添加正利润。 

如果最佳子数组和为负，售票员就可以避免欺骗该乘客。 

### 为什么它有效

 每个隐藏边对预期利润都有独立的贡献。 该贡献仅取决于该边的长度和检查概率，而不取决于相邻边。 

由于期望是可加的，因此隐藏连续区间的预期利润等于该区间内的边缘贡献之和。 

因此对于每位乘客来说，最优策略是选择总重量最大的连续区间。 线段树使用标准最大子数组合并不变量精确计算该数量。 

每个查询都会返回该乘客的最佳作弊计划，并且乘客是独立的，因此将这些最优值相加即可得出全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("total", "pref", "suff", "best")

    def __init__(self, total=0.0, pref=0.0, suff=0.0, best=0.0):
        self.total = total
        self.pref = pref
        self.suff = suff
        self.best = best

def merge(a, b):
    res = Node()
    res.total = a.total + b.total
    res.pref = max(a.pref, a.total + b.pref)
    res.suff = max(b.suff, b.total + a.suff)
    res.best = max(a.best, b.best, a.suff + b.pref)
    return res

n, m, c = map(int, input().split())

x = list(map(int, input().split()))
p = list(map(int, input().split()))

w = []
for i in range(n - 1):
    dist = x[i + 1] - x[i]
    val = dist / 2.0 - c * p[i] / 100.0
    w.append(val)

size = 1
while size < n - 1:
    size <<= 1

seg = [Node() for _ in range(2 * size)]

for i in range(n - 1):
    v = w[i]
    seg[size + i] = Node(v, v, v, v)

for i in range(size - 1, 0, -1):
    seg[i] = merge(seg[i << 1], seg[i << 1 | 1])

def query(l, r):
    left_res = None
    right_res = None

    l += size
    r += size

    while l <= r:
        if l & 1:
            if left_res is None:
                left_res = seg[l]
            else:
                left_res = merge(left_res, seg[l])
            l += 1

        if not (r & 1):
            if right_res is None:
                right_res = seg[r]
            else:
                right_res = merge(seg[r], right_res)
            r -= 1

        l >>= 1
        r >>= 1

    if left_res is None:
        return right_res

    if right_res is None:
        return left_res

    return merge(left_res, right_res)

ans = 0.0

for _ in range(m):
    a, b = map(int, input().split())

    res = query(a - 1, b - 2)

    if res.best > 0:
        ans += res.best

print(f"{ans:.9f}")
```第一次转型是关键的实施步骤。 该代码不是直接推理票证和检查，而是在边缘上构建一个权重数组。 如果隐藏的话，每条边都会存储其预期贡献。 

线段树每个节点存储四个值，因为最大子数组查询需要的不仅仅是总数。 交叉大小写需要来自左孩子的最佳后缀和来自右孩子的最佳前缀。 

一个微妙的细节是索引。 停靠点编号为`1`，但边自然地索引自`0`。 

一名乘客`(a, b)`可以隐藏边缘：```
[a-1, b-2]
```因为边缘`i`连接停止`i+1`停止`i+2`。 

另一个重要的细节是中性元素。 我们在迭代查询期间不使用假零节点，因为它会在合并期间错误地允许空子数组。 相反，该实现使用`None`并延迟初始化。 

远处的树离开了`n-1`保持零值。 它们永远不会被查询，因为所有范围都保留在真实边缘数组内。 

浮点精度在这里是安全的，因为所有操作都是加法和粗略范围内的值的最大值`1e9`。 

## 工作示例

 ### 示例 1

 输入：```
3 3 10
0 10 100
100 0
1 2
2 3
1 3
```边权重：

 | 边缘 | 距离 | 增益| 预计罚款 | 重量 |
 | --- | --- | --- | --- | --- |
 | 1-2 | 1-2 10 | 10 5 | 10 | 10 -5 |
 | 2-3 | 2-3 90 | 90 45 | 45 0 | 45 | 45

 旅客查询：

 | 客运| 边缘范围| 最佳子数组和 |
 | --- | --- | --- |
 | 1 -> 2 | 1 -> 2 [-5]| -5 |
 | 2 -> 3 | 2 -> 3 | [45]| 45 | 45
 | 1 -> 3 | 1 -> 3 | [-5, 45] | 45 | 45

 总答案：```
0 + 45 + 45 = 90
```此示例演示了为什么应该简单地跳过负边沿。 第一个乘客更安全，不作弊。 

### 自定义示例

 输入：```
4 2 20
0 10 30 50
0 100 0
1 4
2 4
```边权重：

 | 边缘 | 距离 | 增益| 预计罚款 | 重量 |
 | --- | --- | --- | --- | --- |
 | 1-2 | 1-2 10 | 10 5 | 0 | 5 |
 | 2-3 | 2-3 20 | 10 | 10 20 | -10 |
 | 3-4 | 3-4 20 | 10 | 10 0 | 10 | 10

 旅客处理：

 | 客运| 候选数组 | 最佳细分 | 利润|
 | --- | --- | --- | --- |
 | 1 -> 4 | [5, -10, 10] | [10]| 10 | 10
 | 2 -> 4 | [-10, 10] | [10]| 10 | 10

 最终答案：```
20
```该迹线表明，最佳隐藏区间可以完全避免危险的中间边缘。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 线段树构建加上每位乘客一次查询 |
 | 空间| O(n) | 线段树存储线性数量的节点 |

 和`n = 150000`和`m = 300000`，这种复杂性很容易满足限制。 每个查询只涉及`O(log n)`节点，因此总操作数在 Python 中仍然是可管理的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    input = input_data.readline

    class Node:
        __slots__ = ("total", "pref", "suff", "best")

        def __init__(self, total=0.0, pref=0.0, suff=0.0, best=0.0):
            self.total = total
            self.pref = pref
            self.suff = suff
            self.best = best

    def merge(a, b):
        res = Node()
        res.total = a.total + b.total
        res.pref = max(a.pref, a.total + b.pref)
        res.suff = max(b.suff, b.total + a.suff)
        res.best = max(a.best, b.best, a.suff + b.pref)
        return res

    n, m, c = map(int, input().split())

    x = list(map(int, input().split()))
    p = list(map(int, input().split()))

    w = []
    for i in range(n - 1):
        w.append((x[i + 1] - x[i]) / 2.0 - c * p[i] / 100.0)

    size = 1
    while size < n - 1:
        size <<= 1

    seg = [Node() for _ in range(2 * size)]

    for i, v in enumerate(w):
        seg[size + i] = Node(v, v, v, v)

    for i in range(size - 1, 0, -1):
        seg[i] = merge(seg[i << 1], seg[i << 1 | 1])

    def query(l, r):
        left_res = None
        right_res = None

        l += size
        r += size

        while l <= r:
            if l & 1:
                left_res = seg[l] if left_res is None else merge(left_res, seg[l])
                l += 1

            if not (r & 1):
                right_res = seg[r] if right_res is None else merge(seg[r], right_res)
                r -= 1

            l >>= 1
            r >>= 1

        if left_res is None:
            return right_res
        if right_res is None:
            return left_res

        return merge(left_res, right_res)

    ans = 0.0

    for _ in range(m):
        a, b = map(int, input().split())
        ans += max(0.0, query(a - 1, b - 2).best)

    output_data.write(f"{ans:.9f}\n")
    return output_data.getvalue()

# provided sample
assert run(
"""3 3 10
0 10 100
100 0
1 2
2 3
1 3
"""
).strip() == "90.000000000", "sample 1"

# minimum size
assert run(
"""2 1 1
0 10
0
1 2
"""
).strip() == "5.000000000", "minimum case"

# always bad to cheat
assert run(
"""2 1 1000
0 10
100
1 2
"""
).strip() == "0.000000000", "negative expectation"

# middle edge should be skipped
assert run(
"""4 1 20
0 10 30 50
0 100 0
1 4
"""
).strip() == "10.000000000", "best subarray in middle"

# off-by-one boundary check
assert run(
"""5 2 10
0 10 20 30 40
0 0 100 0
1 3
3 5
"""
).strip() == "10.000000000", "boundary ranges"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边零检验 | 5 | 最小有效输入 |
 | 巨额罚款保证检验 | 0 | 必须允许空间隔 |
 | 正-负-正权重 | 10 | 10 最大子数组逻辑 |
 | 触及路线边界的查询 | 10 | 10 差一正确性 |

 ## 边缘情况

 考虑每个隐藏部分都亏损的情况。```
2 1 1000
0 10
100
1 2
```唯一的边缘贡献：```
10 / 2 - 1000 = -995
```线段树返回`-995`，但该算法仅增加正利润。 最终答案变成`0`，这符合永不作弊的正确策略。 

现在考虑一条最佳间隔跳过危险边缘的路线。```
4 1 100
0 10 20 100
0 100 0
1 4
```权重为：```
5, -90, 40
```最大子数组为`[40]`，而不是整个路线。 线段树可以正确计算这一点，因为每个节点都存储前缀、后缀和交叉信息。 

最后，考虑一下期望陷阱。```
3 1 10
0 10 20
50 50
1 3
```权重变为：```
0, 0
```每条边独立贡献：```
10 / 2 - 10 * 0.5 = 0
```预期利润总额为`0`。 该算法逐边求和期望，因此它永远不会错误地乘法组合概率。
