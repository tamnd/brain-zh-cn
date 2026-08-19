---
title: "CF 102201E - 经济饮食"
description: "正好有 (2N) 个不同的菜单。 菜单(i)有午餐价格(li)和晚餐价格(di)。 对于持续（k）天的旅行，我们必须选择（k）种不同的午餐菜单和另外（k）种不同的晚餐菜单，并且不允许在两组中出现菜单。"
date: "2026-08-18T20:43:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "E"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 272
verified: true
draft: false
---

[CF 102201E - 经济饮食](https://codeforces.com/problemset/problem/102201/E)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 正好有 (2N) 个不同的菜单。 菜单(i)有午餐价格(l_i)和晚餐价格(d_i)。 对于持续（k）天的旅行，我们必须选择（k）种不同的午餐菜单和另外（k）种不同的晚餐菜单，并且不允许在两组中出现菜单。 目标是最小化所有 (2k) 价格的总和。 我们需要每个 (k=1,\dots,N) 的最小值。 

查看部分解决方案的一个有用方法是将每个菜单分为三种状态。 当前可以未使用、分配给午餐或分配给晚餐。 将菜单从未使用的费用改为午餐费用 (l_i)，同时将其从未使用的费用改为晚餐费用 (d_i)。 将已选择的晚餐菜单移至午餐会导致成本变化 (l_i-d_i)，而从午餐到晚餐的成本也会发生类似变化 (d_i-l_i)。 

限制（N\le 250000）意味着可以有（500000）个菜单。 (O(N^2)) 算法在上限上已经需要大约 (6.25\times10^{10}) 次基本迭代，远远超出了 3 秒限制所允许的范围。 我们基本上需要 (O(N\log N)) 或 (O(N)) 工作。 价格可以大到(10^9)，最终答案中可以有(500000)个选择的餐食，所以总数可以达到(5\times10^{14})。 Python 整数会自动处理此问题，而 C++ 实现则需要 64 位整数。 

第一个棘手的情况是最便宜的午餐和最便宜的晚餐是相同的菜单。 例如，```
1
1 100
2 2
```正确答案是`3`，因为第一个菜单可以是 1 人的午餐，第二个菜单必须是 2 人的晚餐。简单地单独拿最便宜的午餐和最便宜的晚餐给出（1+100=101），这违反了不可重复使用的条件。 

另一个微妙的情况是，替换已选择的菜单比采用最便宜的当前未使用的菜单更便宜。 例如，```
2
1 100
100 1
2 1000
3 1000
```第一个答案是（2），午餐使用第一个菜单，晚餐使用第二个菜单。 第二天，剩余的晚餐价格都是 1000，但我们可以将第一个菜单从午餐移至晚餐，将其贡献增加 (100-1=99)，并使用午餐价格为 3 的菜单作为午餐。 如果从第一个状态考虑直接排列，则第二个答案因此是（2+99+3=104），但实际最佳状态是通过首先将菜单3作为午餐获得的，总计为（2+2+102=106）。 这说明了为什么每次增强都必须将直接选择与交换进行比较，而不是总是采用最便宜的未使用菜单。 

最小输入也需要特殊处理，因为在选择任何内容之前不可能进行交换。 为了```
1
4 9
5 3
```唯一有效的一对使用不同的菜单，所以答案是`7`。 

最后，同等价格并不是特殊的数学情况，但它们对于暴露状态更新错误很有用。 和```
2
5 5
5 5
5 5
5 5
```答案是`10`和`20`。 任何意外允许菜单在午餐和晚餐堆中保持可用的实现都可能产生无效值。 

## 方法

 直接的暴力方法是枚举每个 (k) 可能的午餐和晚餐分配，拒绝重复使用菜单的分配，并计算其成本。 对于 (k=N)，选择午餐套餐已经给出了 (\binom{2N}{N}) 种可能性，因为晚餐套餐被迫成为其补充。 评估每种可能性需要 (\Theta(N)) 工作，因此 (k) 的单个值需要 (\Theta(N\binom{2N}{N})) 运算。 即使在（N=20），（\binom{40}{20}=137846528820），也已经太大了。 在 (N=250000) 处，枚举根本不可行。 

自然的优化是停止将每个（k）视为完全独立的问题。 假设我们已经有了包含 (k-1) 份午餐和 (k-1) 份晚餐的最佳解决方案。 我们希望将这两个计数都加一。 这正是增量最小成本流问题。 竞赛教程通过连续的最短增广路径描述了相同的公式。 

想象一个流网络，其中源连接到每个菜单，每个菜单连接到午餐和晚餐节点，而这两个节点连接到接收器。 一份菜单只能承载一个流量单位，所以不能同时是午餐和晚餐。 午餐的边际成本 (l_i)，晚餐的边际成本 (d_i)。 

假设我们目前将午餐数量增加一。 有用的增广路径只有两种可能的形状。 第一种是直接拿一份没用过的菜单当午餐，付钱（l_i）。 第二种是将未使用的晚餐菜单移至午餐。 如果晚餐选择菜单 (x)，则将其更改为午餐费用 (l_x-d_x)。 因此第二条路径的成本

 [
 d_y+(l_x-d_x),
 ]

 其中 (y) 是未使用的菜单。 

没有第三种有用的路径形状。 进入晚餐节点后，结束午餐的唯一方法是使用所选晚餐菜单的反向边缘。 较长的路线将重新访问两个类别节点之一，并包含一个可移动的循环。 

同样的论点也适用于增加晚餐次数。 我们要么直接选择最便宜的未使用的菜单作为晚餐，要么将选定的午餐菜单移至晚餐，同时选择未使用的菜单作为午餐。 

这一观察结果将整个问题简化为维护四个优先级队列。 第一个包含按午餐价格订购的未使用菜单。 第二个包含按晚餐价格订购的未使用菜单。 第三个包含按 (l_i-d_i) 订购的精选晚餐菜单，因为这是从晚餐转到午餐的成本。 第四个包含按 (d_i-l_i) 订购的精选午餐菜单，因为这是从午餐转到晚餐的成本。 

每次增强都会选择两个可能的增强路径中更便宜的一个，执行相应的状态更改，然后继续。 由于每一步都是来自已经最优流的最短增强路径，因此结果状态仍然是最优的。 这四个堆让我们在 (O(\log N)) 时间内找到每个候选者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (\Theta(N\binom{2N}{N})) 单独对于 (k=N) | 指数| 太慢了 |
 | 最佳| (O(N\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 存储每个菜单的午餐价格、晚餐价格和当前状态。 使用状态`0`对于未使用的，`1`吃午餐，以及`2`吃晚饭。 状态数组也使得从堆中的延迟删除成为可能。 
2. 将每个菜单放入以 (l_i) 为关键字的未使用午餐堆中，以及以 (d_i) 为关键字的未使用晚餐堆中。 最初，两个堆都包含每个菜单，因为尚未选择任何内容。 
3. 维护一个由 (l_i-d_i) 键控的选定晚餐菜单的堆。 如果这样的菜单从晚餐变成午餐，这正是它的成本变化。 为对称操作的（d_i-l_i）键控的选定午餐菜单维护另一个堆。 
4.对于(1)到(N)中的每一个(k)，首先将所需的午餐菜单数量从(k-1)增加到(k)。 令 (u) 为当前未使用的最便宜的午餐菜单。 令 (v) 为所选的具有最小值 (l_v-d_v) 的晚餐菜单，令 (w) 为当前未使用的最便宜的晚餐菜单。 两种可能的成本是直接选择的 (l_u) 和交换的 ((l_v-d_v)+d_w)。 选择较小的那个。 
5. 如果直接午餐路径获胜，则将 (u) 从未使用移动到午餐并将 (l_u) 添加到总数中。 如果交换路径获胜，则将 (v) 从晚餐移至午餐，将 (w) 从未使用移至晚餐，并将 ((l_v-d_v)+d_w) 添加到总数中。 
6. 现在将所需的晚餐菜单数量从 (k-1) 增加到 (k)。 令 (u) 为最便宜的未使用晚餐菜单。 令 (v) 为所选的具有最小值 (d_v-l_v) 的午餐菜单，令 (w) 为最便宜的未使用午餐菜单。 直接候选成本 (d_u)，而交换候选成本 ((d_v-l_v)+l_w)。 再次选择较小的路径。 
7. 根据选择的晚餐增强更新状态和适当的交换堆。 在两次增强之后，正好 (k) 个菜单处于午餐状态，并且正好 (k) 个菜单处于晚餐状态。 记录累计成本作为 (k) 的答案。 
8. 在所有堆中使用惰性删除。 当菜单更改状态时，旧的堆条目不会被物理删除。 在读取堆的最小值之前，如果其菜单不再处于该堆所表示的状态，请重复丢弃其顶部条目。 每个过时条目最多被删除一次，因此总堆工作与插入条目的数量保持线性关系。 

### 为什么它有效

 不变的是，在每次增强之后，当前任务都是当前午餐和晚餐计数的最低成本任务。 在剩余流网络中，任何将午餐计数增加一的增强都具有算法所考虑的两种形式之一：选择未使用的午餐菜单，或选择未使用的晚餐菜单，同时将选定的晚餐菜单反转为午餐。 该算法选择这些最短增广路径中更便宜的一个。 同样的说法也适用于晚餐的增补。 从空的最优流开始，连续的最短增强保持最优性，因此在 (k) 的午餐和晚餐增强之后，状态对于 (k) 午餐和 (k) 晚餐来说是最优的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def compute(n, menus):
    m = 2 * n

    lunch = [0] * m
    dinner = [0] * m

    for i, (l, d) in enumerate(menus):
        lunch[i] = l
        dinner[i] = d

    # 0 = unused, 1 = lunch, 2 = dinner
    state = [0] * m

    # Unused menus.
    unused_lunch = [(lunch[i], i) for i in range(m)]
    unused_dinner = [(dinner[i], i) for i in range(m)]
    heapq.heapify(unused_lunch)
    heapq.heapify(unused_dinner)

    # Selected dinner, ordered by cost of changing dinner -> lunch.
    dinner_to_lunch = []

    # Selected lunch, ordered by cost of changing lunch -> dinner.
    lunch_to_dinner = []

    def clean(heap, wanted_state):
        while heap and state[heap[0][1]] != wanted_state:
            heapq.heappop(heap)
        return heap[0] if heap else None

    def move_unused_to_lunch(i):
        state[i] = 1
        heapq.heappush(lunch_to_dinner, (dinner[i] - lunch[i], i))

    def move_unused_to_dinner(i):
        state[i] = 2
        heapq.heappush(dinner_to_lunch, (lunch[i] - dinner[i], i))

    def move_dinner_to_lunch(i):
        state[i] = 1
        heapq.heappush(lunch_to_dinner, (dinner[i] - lunch[i], i))

    def move_lunch_to_dinner(i):
        state[i] = 2
        heapq.heappush(dinner_to_lunch, (lunch[i] - dinner[i], i))

    total = 0
    answer = []

    for _ in range(n):
        # Increase the lunch count by one.
        direct = clean(unused_lunch, 0)
        swap_menu = clean(dinner_to_lunch, 2)
        replacement = clean(unused_dinner, 0)

        direct_cost = direct[0] if direct is not None else 10**30

        if swap_menu is not None and replacement is not None:
            swap_cost = swap_menu[0] + replacement[0]
        else:
            swap_cost = 10**30

        if direct_cost <= swap_cost:
            i = direct[1]
            total += direct_cost
            move_unused_to_lunch(i)
        else:
            old_dinner = swap_menu[1]
            new_dinner = replacement[1]

            total += swap_cost
            move_dinner_to_lunch(old_dinner)
            move_unused_to_dinner(new_dinner)

        # Increase the dinner count by one.
        direct = clean(unused_dinner, 0)
        swap_menu = clean(lunch_to_dinner, 1)
        replacement = clean(unused_lunch, 0)

        direct_cost = direct[0] if direct is not None else 10**30

        if swap_menu is not None and replacement is not None:
            swap_cost = swap_menu[0] + replacement[0]
        else:
            swap_cost = 10**30

        if direct_cost <= swap_cost:
            i = direct[1]
            total += direct_cost
            move_unused_to_dinner(i)
        else:
            old_lunch = swap_menu[1]
            new_lunch = replacement[1]

            total += swap_cost
            move_lunch_to_dinner(old_lunch)
            move_unused_to_lunch(new_lunch)

        answer.append(total)

    return answer

def solve():
    n = int(input())
    menus = [tuple(map(int, input().split())) for _ in range(2 * n)]
    print("\n".join(map(str, compute(n, menus))))

if __name__ == "__main__":
    solve()
```两个未使用的堆使用所有菜单进行初始化。 当选择菜单时，它们永远不会被明确删除。 相反，状态数组告诉`clean`顶部条目是否仍然可用。 这避免了从 Python 中进行昂贵的任意删除`heapq`。 

当菜单变成午餐时，它的 (d_i-l_i) 值被插入到`lunch_to_dinner`。 当它变成晚餐时，它的(l_i-d_i)值被插入到`dinner_to_lunch`。 更改类别的菜单可能会在旧堆中留下过时的条目。 这些条目在到达顶部时将被丢弃。 

午餐增加在晚餐增加之前进行，因为两种容量一次增加一个。 第一次增强后，状态代表包含 (k) 份午餐和 (k-1) 份晚餐的最佳解决方案。 然后，第二次增强会产生每个 (k) 的最佳解决方案。 

比较使用`<=`，因此关系始终选择直接路径。 任何并列的选择都是最优的，因此这对答案没有影响。 

总成本可能约为 (5\times10^{14})，因此无法安全地存储在 32 位整数中。 Python 的任意精度整数使得累加是安全的。 

实现使用`10**30`作为无法到达的候选者，而不是依赖于特殊的堆状态。 在给定的约束下，每个实际答案都远小于该值。 

## 工作示例

 ### 示例 1

 输入是```
1
4 9
5 3
```有两个菜单。 最初两者均未使用。 我们需要一顿午餐和一顿晚餐。 

| 步骤| 状态变化 | 直接候选人| 交换候选人 | 选择成本| 总计 |
 | ---| ---| ---| ---| ---| ---|
 | 午餐| 菜单 1：未使用 -> 午餐 | 4 | 不可用 | 4 | 4 |
 | 晚餐| 菜单 2：未使用 -> 晚餐 | 3 | 不可用 | 3 | 7 |

 第一个菜单的午餐更便宜，而第二个菜单的晚餐在第一个菜单吃完后更便宜。 答案是`7`。 

此示例确认了基本不变量，并检查了交换堆不包含任何内容的初始条件。 

### 示例 2

 输入是```
2
1 6
2 4
5 3
3 1
```按输入顺序调用菜单 1 至 4。 

| (k) | 增强| 直接候选人| 交换候选人 | 选择的行动 | 运行总计 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 午餐| 菜单 1，费用 1 | 不可用 | 菜单 1 -> 午餐 | 1 |
 | 1 | 晚餐| 菜单 4，费用 1 | 不可用 | 菜单 4 -> 晚餐 | 2 |
 | 2 | 午餐| 菜单 2，费用 2 | 菜单4 -> 午餐费用(3-1+3=5) | 菜单 2 -> 午餐 | 4 |
 | 2 | 晚餐| 菜单 3，费用 3 | 菜单1 -> 晚餐费用(6-1+5=10) | 菜单 3 -> 晚餐 | 7 |

 在第一对增强之后，选择菜单 1 和 4。 对于第二顿午餐，菜单 2 比将菜单 4 从晚餐更改为午餐便宜。 对于第二顿晚餐，菜单 3 比将菜单 1 从午餐改为晚餐便宜。 

结果的答案是`2`和`7`，匹配样本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N\log N)) | 有 (2N) 个增强，每个增强执行恒定数量的堆操作。 每个陈旧的堆条目最多被删除一次。 |
 | 空间| (O(N)) | 在整个算法中创建了 (2N) 个菜单和线性数量的堆条目。 |

 对于 (N=250000)，该算法仅对每个菜单执行恒定数量的堆操作，每次成本为 (O(\log N))。 这适用于 (500000) 菜单输入大小，而约束排除了二次或指数方法。 

## 测试用例

 以下测试工具假设上述解决方案已另存为`solution.py`。 它的调用方式是一样的`compute`主程序使用的函数，因此断言测试实际算法而不是单独的实现。```python
import io
import sys

from solution import compute

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    n = data[0]
    menus = []
    p = 1

    for _ in range(2 * n):
        menus.append((data[p], data[p + 1]))
        p += 2

    return "\n".join(map(str, compute(n, menus))) + "\n"

# Sample 1
assert run("""\
1
4 9
5 3
""") == """\
7
""", "sample 1"

# Sample 2
assert run("""\
2
1 6
2 4
5 3
3 1
""") == """\
2
7
""", "sample 2"

# Sample 3
assert run("""\
4
7 5
5 7
7 4
4 2
2 5
6 4
3 2
1 9
""") == """\
3
7
16
26
""", "sample 3"

# Minimum size, and the cheapest lunch and dinner belong to the same menu.
assert run("""\
1
1 100
2 2
""") == """\
3
""", "must not reuse one menu"

# All prices equal.
assert run("""\
2
5 5
5 5
5 5
5 5
""") == """\
10
20
""", "all equal"

# Forces a lunch -> dinner swap on the second dinner augmentation.
assert run("""\
2
1 100
100 1
2 1000
3 1000
""") == """\
2
106
""", "swap is cheaper than direct dinner selection"

# Maximum-size structural test.
# Every menu costs 1 in both roles, so the kth answer is exactly 2*k.
n = 250000
inp = str(n) + "\n" + ("1 1\n" * (2 * n))
expected = "".join(f"{2 * k}\n" for k in range(1, n + 1))
assert run(inp) == expected, "maximum-size all-equal case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 100 / 2 2`|`3`| 最便宜的午餐和晚餐不能使用相同的菜单。 |
 |`2 / four menus all 5 5`|`10, 20`| 相等的价格、重复的堆键和精确的状态计数。 |
 |`2 / 1 100, 100 1, 2 1000, 3 1000`|`2, 106`| 类别交换比为所请求的类别选择最便宜的未使用菜单要便宜得多。 |
 |`250000 / 500000 menus all 1 1`|`2, 4, ..., 500000`| 最大输入大小、重复相等键、堆性能和 (k=N) 处的边界行为。 |

 ## 边缘情况

 第一个边缘情况是最小输入并且不存在任何最初选择的菜单。 为了```
1
4 9
5 3
```午餐增强看不到选定的晚餐菜单，因此仅存在成本为 4 的直接候选者。 菜单 1 变为午餐后，晚餐增加看到菜单 2 的晚餐价格为 3 并选择它。 总数变成7，这就是所需的输出。 

第二种边缘情况是最便宜的午餐和最便宜的晚餐候选人之间的冲突。 为了```
1
1 100
2 2
```午餐增加选择菜单 1 的成本为 1。随后，晚餐堆忽略菜单 1，因为其状态为午餐，因此选择晚餐价格为 2 的菜单 2。 答案是 3。一对独立的最小搜索会错误地使用菜单 1 两次。 

第三种边缘情况是交换优于直接选择。 为了```
2
1 100
100 1
2 1000
3 1000
```第一天午餐选择菜单 1，晚餐选择菜单 2，总计为 2。第二次午餐时，直接选择菜单 3，成本为 2。对于第二次晚餐，最便宜的未使用晚餐成本为 1000。相反，菜单 1 可以从午餐移至晚餐，增加 (100-1=99)，而菜单 4 成为 3 的新午餐。因此，第二次增加的成本为 (99+3=102)，总计为 106。 算法准确地找到了这种残差路径的改进。 

第四个边缘情况是最终迭代，必须选择每个菜单。 考虑```
2
5 5
5 5
5 5
5 5
```第一次迭代后，有两个选定的菜单和两个未使用的菜单，总共 10 个。第二次午餐和晚餐增加消耗剩余的两个菜单，每个菜单增加 5 个。 最终答案是 20。该算法永远不需要读取不存在的未使用菜单，因为在第 (k) 对的开头正好有 (2(N-k+1)) 个未使用菜单。 

第五个边缘情况是大型算术。 当 (N=250000) 且每个价格等于 (10^9) 时，最终答案为 (500000\cdot10^9=5\times10^{14})。 堆逻辑不变，但累加器必须支持远大于 (2^{31}-1) 的值。 Python 的整数表示直接处理这个问题。
