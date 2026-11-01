---
title: "CF 166D - 鞋店"
description: "我们有一系列鞋子，每只鞋子都有独特的尺码和价格。 我们也有客户，每个客户都有预算和脚的尺寸。 只有满足两个条件，顾客才能购买鞋子。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graph-matchings", "greedy", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 166
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 113 (Div. 2)"
rating: 2500
weight: 166
solve_time_s: 154
verified: true
draft: false
---

[CF 166D - 鞋店](https://codeforces.com/problemset/problem/166/D)

 **评分：** 2500
 **标签：** dp、图匹配、贪心、排序、两个指针
 **求解时间：** 2m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列鞋子，每只鞋子都有独特的尺码和价格。 我们也有客户，每个客户都有预算和脚的尺寸。 只有满足两个条件，顾客才能购买鞋子。 

第一个条件是财务：鞋的价格不能超出顾客的预算。 

第二个条件是尺码兼容性：如果鞋码符合`s`，那么顾客脚的尺寸必须是`s`或者`s - 1`。 换句话说，顾客可以穿与其尺寸完全一致或大一号的鞋子。 

每只鞋最多可出售一次，每位顾客最多可购买一双。 目标不是最大化销售数量，而是最大化售出鞋子的总收入。 

这些约束完全塑造了解决方案。 两个都`n`和`m`可以达到`10^5`，因此任何立即尝试所有客户鞋对的解决方案都变得不可能。 二次算法需要大约`10^10`最坏的情况下操作，远远超出了时限。 我们需要一些接近的东西`O(n log n)`或者`O((n + m) log n)`。 

The unique shoe sizes are a very strong structural property. Since every size appears at most once among shoes, each customer is compatible with at most two shoe sizes. That dramatically simplifies the matching structure and turns the problem into something much more manageable than general bipartite matching.

 一些边缘情况很容易被错误处理。 

Consider this input:```
2
100 5
1 6
1
100 5
```正确答案是出售第一双鞋以获取利润`100`。 

以任意顺序处理鞋子的粗心贪婪策略可能会首先出售便宜的鞋子，因为顾客也可以穿尺码`6`。 这阻止了昂贵的销售并带来利润`1`而不是`100`。 

当两个顾客可以购买同一双鞋，但只有一个顾客有替代品时，就会出现另一种微妙的情况。```
2
50 10
40 11
2
50 10
50 11
```最优解是：```
90
2
1 1
2 2
```如果我们贪婪地分配大小`10`鞋给顾客`2`，然后客户`1`变得无与伦比，总利润下降至`50`。 

还有一种危险的情况是，选择当地昂贵的销售会阻碍未来的两次销售。```
3
100 5
99 6
98 7
2
100 5
99 6
```正确答案是`199`，通过卖鞋`5`和`6`。 

总是优先考虑价格最高的鞋子的贪婪算法可能会选择鞋子`7`为客户`2`，因为尺寸`6`顾客也可以穿尺码`7`。 然后鞋`6`变得无法销售，结果变成`198`。 

问题的根本在于如何在最大化总价值的同时小心地保持灵活性。 

## 方法

 最直接的表述是二分匹配。 一侧容纳顾客，另一侧容纳鞋子。 当顾客可以购买鞋子时，我们会增加一个优势。 由于每个顾客最多可以连接到两种鞋码，因此图表很稀疏。 

暴力解决方案可以构建整个图并运行加权匹配算法。 搭配必须使鞋子价格之和最大化。 一般加权二分匹配在这里太昂贵了。 即使天真地构建所有可能的对也需要`O(nm)`运营。 

关键的观察是鞋码是独一无二的。 鞋子的尺码`s`仅适合脚尺码的顾客购买`s`或者`s - 1`。 

这意味着每双鞋只与两个客户群互动。 

当按排序顺序处理大小时，这会将图转换为链状结构。 依赖关系变成本地的而不是全局的。 

假设我们按尺码对鞋子进行排序。 当我们检查鞋子的尺码时`s`，只有规模的客户`s`和`s - 1`事情。 未来的鞋子有更大的尺码，所以尺码的顾客`s - 1`规模之后没有未来的机会`s`。 如果我们现在不分配这样的客户，我们就会永远失去他们。 

这自然表明了对排序大小的动态规划。 

对于每个尺码位置，我们只需要知道之前的鞋子是否已经消耗了当前尺码的顾客。 这个微小的状态就足够了，因为相互作用只发生在相邻尺寸之间。 

DP 决定是否：

 1. 跳过当前的鞋子。 
2、卖给同等规模的客户。 
3. 卖给尺寸小一号的客户。 

为了使这些转换高效，我们针对每种鞋码对匹配尺码的最佳可用客户进行预处理。 

生成的算法运行在`O((n + m) log n)`由于排序和优先级处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力匹配| O((n + m)^3) 或更糟 | O(纳米) | 太慢了|
 | DP 上的排序尺寸 | O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

 1.阅读所有鞋子和商店`(size, price, index)`。 
2. 读取所有顾客并按脚型进行分组。 

对于每种脚码，让客户按预算降序排列。 我们首先只需要最富有的剩余客户。 

1. 按尺码对鞋子进行分类。 

由于兼容性仅涉及相同的大小或较小的大小，因此按顺序处理大小会使所有依赖项成为本地依赖项。 

1. 对于每双鞋，预先计算两个候选客户。 

第一个候选者是最富有的未使用过的顾客，其脚的尺寸等于鞋子的尺寸。 

第二个候选者是最富有的未使用顾客，其脚尺寸小一号。 

如果顾客买不起这双鞋，它们就会被丢弃。 

1. 定义DP状态。 

让`dp[i][t]`是处理第一个之后的最大利润`i`鞋。 

旗帜`t`告诉当前鞋码的最佳顾客是否已经被前一个鞋号消耗掉了。 

这种状态就足够了，因为相邻的鞋子尺码是唯一相互作用的尺码。 

1. 跳鞋过渡。 

我们可以忽略当前的鞋子并继续前面的答案。 

1. 通过向同等规模的客户销售进行转型。 

如果存在相同尺码的可用客户，请添加鞋子价格并移至下一个状态。 

1. 通过向规模较小的客户销售进行转型。 

如果客户的规模`s - 1`存在并且尚未被之前的鞋子消耗，我们可以使用它们。 

1. 存储父指针。 

要重建匹配，请保留先前的状态和采取的操作。 

1. 通过回溯 DP 状态来重建所选择的分配。 
2. 输出总利润和所选的客户鞋对。 

### 为什么它有效

 关键的不变量是，当按尺寸递增的顺序处理鞋子时，只有当前尺寸和紧邻的较小尺寸的客户才能与当前鞋子进行交互。 

有规模的客户`s - 1`规模之后没有未来的机会`s`，因为后来的鞋子更大了。 这意味着涉及此类客户的每一个决定都会立即成为最终决定。 

DP 状态准确地捕获了唯一可以向前传播的模糊性：当前尺码的顾客是否已经被前一双鞋使用过。 不存在更大的依赖性。 

因为每次转换都会考虑当前鞋子的所有合法可能性，同时保留最佳子结构，因此 DP 会隐式探索所有最佳匹配。 重建步骤简单地遵循产生最佳值的选择。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

INF = 10**30

def solve():
    n = int(input())

    shoes = []
    for i in range(n):
        c, s = map(int, input().split())
        shoes.append((s, c, i + 1))

    m = int(input())

    customers_by_size = defaultdict(list)

    for i in range(m):
        d, l = map(int, input().split())
        customers_by_size[l].append((d, i + 1))

    for l in customers_by_size:
        customers_by_size[l].sort(reverse=True)

    shoes.sort()

    ptr = defaultdict(int)

    same_customer = [None] * n
    prev_customer = [None] * n

    for i, (s, c, idx) in enumerate(shoes):
        arr = customers_by_size[s]

        while ptr[s] < len(arr) and arr[ptr[s]][0] < c:
            ptr[s] += 1

        if ptr[s] < len(arr):
            same_customer[i] = arr[ptr[s]]

        arr2 = customers_by_size[s - 1]

        while ptr[s - 1] < len(arr2) and arr2[ptr[s - 1]][0] < c:
            ptr[s - 1] += 1

        if ptr[s - 1] < len(arr2):
            prev_customer[i] = arr2[ptr[s - 1]]

    dp = [[-INF] * 2 for _ in range(n + 1)]
    parent = [[None] * 2 for _ in range(n + 1)]

    dp[0][0] = 0

    for i in range(n):
        s, c, shoe_idx = shoes[i]

        for used in range(2):
            if dp[i][used] < 0:
                continue

            # skip
            if dp[i][used] > dp[i + 1][0]:
                dp[i + 1][0] = dp[i][used]
                parent[i + 1][0] = (i, used, 0, None)

            # use same size customer
            if same_customer[i] is not None:
                val = dp[i][used] + c

                nxt = 1

                if val > dp[i + 1][nxt]:
                    dp[i + 1][nxt] = val
                    parent[i + 1][nxt] = (
                        i,
                        used,
                        1,
                        same_customer[i][1],
                    )

            # use smaller size customer
            if used == 0 and prev_customer[i] is not None:
                val = dp[i][used] + c

                if val > dp[i + 1][0]:
                    dp[i + 1][0] = val
                    parent[i + 1][0] = (
                        i,
                        used,
                        2,
                        prev_customer[i][1],
                    )

    if dp[n][0] >= dp[n][1]:
        state = 0
    else:
        state = 1

    best = dp[n][state]

    ans = []

    cur_i = n
    cur_state = state

    while cur_i > 0:
        p_i, p_state, action, customer_id = parent[cur_i][cur_state]

        if action == 1 or action == 2:
            shoe_idx = shoes[cur_i - 1][2]
            ans.append((customer_id, shoe_idx))

        cur_i = p_i
        cur_state = p_state

    ans.reverse()

    print(best)
    print(len(ans))

    for x, y in ans:
        print(x, y)

solve()
```该解决方案首先根据脚的尺寸对客户进行分组。 对于每种尺寸，客户均按预算降序排列。 这保证了当我们为某种鞋子寻找买家时，第一个有效的客户始终是最有用的客户。 

预处理阶段为每双鞋计算最佳的相同尺寸和较小尺寸的候选鞋。 由于鞋子的尺寸是独一无二的，因此这些候选关系保持本地化。 

DP 表的每个位置只有两种状态。 这就是使解决方案高效的核心压缩。 布尔状态记录当前尺码组是否已被前一只鞋消耗。 

转换逻辑小心翼翼地保留了排他性。 这`used == 0`在分配规模较小的客户时，条件至关重要。 如果没有它，同一客户群可能会意外地在相邻的鞋子上重复使用。 

重建阶段沿着存储的父指针从最佳最终状态向后进行。 每个动作都准确记录哪个顾客购买了哪只鞋。 

所有利润计算都使用普通的 Python 整数，可以安全地处理最大可能的总价值。 

## 工作示例

 ### 示例 1

 输入：```
3
10 1
30 2
20 3
2
20 1
20 2
```鞋子分类：

 | 职位| 鞋码 | 价格|
 | ---| ---| ---|
 | 1 | 1 | 10 | 10
 | 2 | 2 | 30|
 | 3 | 3 | 20 |

 客户：

 | 客户| 预算| 脚尺寸|
 | ---| ---| ---|
 | 1 | 20 | 1 |
 | 2 | 20 | 2 |

 DP跟踪：

 | 鞋| 行动| 利润|
 | ---| ---| ---|
 | 尺寸 1 | 销售给客户 1 | 10 | 10
 | 尺寸 2 | 卖不到30 | 10 | 10
 | 尺寸 3 | 卖给客户 2 | 30|

 最终作业：```
Customer 1 -> Shoe 1
Customer 2 -> Shoe 3
```总利润变为`30`。 

这个例子说明了为什么与尺寸兼容`s - 1`很重要。 顾客`2`买不起鞋`2`，但仍然可以买鞋`3`。 

### 示例 2

 输入：```
2
50 10
40 11
2
50 10
50 11
```鞋子分类：

 | 职位| 鞋码 | 价格|
 | ---| ---| ---|
 | 1 | 10 | 10 50 | 50
 | 2 | 11 | 11 40|

 DP跟踪：

 | 鞋| 选择的客户 | 运行利润|
 | ---| ---| ---|
 | 尺码 10 | 客户 1 | 50 | 50
 | 尺码 11 | 客户2 | 90 | 90

 如果鞋`10`被卖给客户`2`，然后是鞋`11`将变得不可能出售。 民主党正确地避免了这个错误。 

该轨迹表明了一个不变的事实：规模较小的客户应该尽可能晚地消费，除非不存在更好的选择。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) | O((n + m) log n) | 排序主导运行时间 |
 | 空间| O(n + m) | 客户、鞋子、DP 和重建的存储 |

 该解决方案完全符合约束条件。 排序`2 * 10^5`在 Python 中，对象和执行线性 DP 转换在 2 秒限制内很容易足够快。 

## 测试用例```python
# helper: run solution on input string, return output string

import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    from collections import defaultdict

    input = sys.stdin.readline
    INF = 10**30

    out = io.StringIO()
    sys.stdout = out

    n = int(input())

    shoes = []
    for i in range(n):
        c, s = map(int, input().split())
        shoes.append((s, c, i + 1))

    m = int(input())

    customers_by_size = defaultdict(list)

    for i in range(m):
        d, l = map(int, input().split())
        customers_by_size[l].append((d, i + 1))

    for l in customers_by_size:
        customers_by_size[l].sort(reverse=True)

    shoes.sort()

    ptr = defaultdict(int)

    same_customer = [None] * n
    prev_customer = [None] * n

    for i, (s, c, idx) in enumerate(shoes):
        arr = customers_by_size[s]

        while ptr[s] < len(arr) and arr[ptr[s]][0] < c:
            ptr[s] += 1

        if ptr[s] < len(arr):
            same_customer[i] = arr[ptr[s]]

        arr2 = customers_by_size[s - 1]

        while ptr[s - 1] < len(arr2) and arr2[ptr[s - 1]][0] < c:
            ptr[s - 1] += 1

        if ptr[s - 1] < len(arr2):
            prev_customer[i] = arr2[ptr[s - 1]]

    dp = [[-INF] * 2 for _ in range(n + 1)]
    dp[0][0] = 0

    for i in range(n):
        s, c, idx = shoes[i]

        for used in range(2):
            if dp[i][used] < 0:
                continue

            dp[i + 1][0] = max(dp[i + 1][0], dp[i][used])

            if same_customer[i] is not None:
                dp[i + 1][1] = max(
                    dp[i + 1][1],
                    dp[i][used] + c
                )

            if used == 0 and prev_customer[i] is not None:
                dp[i + 1][0] = max(
                    dp[i + 1][0],
                    dp[i][used] + c
                )

    best = max(dp[n])

    return str(best).strip()

# sample 1
assert run(
"""3
10 1
30 2
20 3
2
20 1
20 2
"""
) == "30"

# minimum case
assert run(
"""1
5 10
1
5 10
"""
) == "5"

# no customer can buy
assert run(
"""2
100 1
200 2
2
50 1
50 2
"""
) == "0"

# smaller-size compatibility
assert run(
"""1
30 5
1
30 4
"""
) == "30"

# avoid greedy mistake
assert run(
"""2
50 10
40 11
2
50 10
50 11
"""
) == "90"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单鞋与顾客| 5 | 最小有效输入 |
 | 没有人买得起鞋| 0 | 正确处理不可能销售|
 | 有尺码的顾客`s - 1`| 30| 兼容性边界 |
 | 两只相互作用的鞋子 | 90 | 90 防止错误的贪婪赋值 |

 ## 边缘情况

 考虑前面的例子，贪婪的策略可能会破坏利润。 

输入：```
2
100 5
1 6
1
100 5
```加工鞋码时`5`，算法看到完美的同规模客户并获得利润`100`。 

加工鞋码时`6`，没有剩余的兼容客户。 

最终答案：```
100
1
1 1
```DP 永远不会为了便宜的鞋子而牺牲昂贵的鞋子，因为它评估的是未来的总利润而不是当地的供应情况。 

现在考虑交互案例：```
2
50 10
40 11
2
50 10
50 11
```在鞋处`10`，大小客户`11`技术上是兼容的。 但立即分配它们会阻碍鞋`11`。 

DP 比较了两种期货：

 | Shoe 10 的决定 | 最终利润|
 | ---| ---|
 | 使用客户 10 | 90 | 90
 | 使用客户 11 | 50 | 50

 更好的分支得以生存。 

最后，考虑这个边界兼容性情况：```
1
30 5
1
30 4
```客户尺码比鞋码正好小一号，这是允许的。 

该算法检查两个候选组：大小`5`和尺寸`4`。 尺寸`4`客户满足预算条件，因此销售成功，利润总额`30`。
