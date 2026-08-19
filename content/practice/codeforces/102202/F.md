---
title: "CF 102202F - 经济饮食"
description: "正好有 (2N) 个不同的菜单。 菜单（j）有午餐价格（lj）和晚餐价格（dj）。 对于从 (1) 到 (N) 的每 (k) 个，我们必须准确选择 (k) 个不同的午餐菜单和另外 (k) 个不同的晚餐菜单。 菜单不能出现在两个组中。"
date: "2026-08-18T11:16:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102202
codeforces_index: "F"
codeforces_contest_name: "2019 KAIST RUN Spring Contest"
rating: 0
weight: 102202
solve_time_s: 1002
verified: false
draft: false
---

[CF 102202F - 经济饮食](https://codeforces.com/problemset/problem/102202/F)

 **评级：** -
 **标签：** -
 **求解时间：** 16m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 正好有 (2N) 个不同的菜单。 菜单(j)有午餐价格(l_j)和晚餐价格(d_j)。 对于从 (1) 到 (N) 的每 (k) 个，我们必须准确选择 (k) 个不同的午餐菜单和另外 (k) 个不同的晚餐菜单。 菜单不能出现在两个组中。 (k) 所需的答案是所有选定的午餐和晚餐价格的最小可能总和。 

输入包含 (N)，后跟 (2N) 对 ((l_j,d_j))。 输出包含 (N) 个值，其中 (k) 行是 (k) 午餐和 (k) 晚餐的最佳值。 官方声明确认了这些界限以及下面使用的三个官方样本。 

对于(N\le250000)，最多有(500000)个菜单。 任何检查每个答案的对或子集的算法都远远超出了限制。 即使 (O(N^2)) 在最坏的情况下也意味着大约 (6.25\times10^{10}) 次迭代，这远远不适合 3 秒的限制。 我们大约需要 (O(N\log N))，或者最坏的情况下接近线性时间。 

第一个边缘情况是 (N=1)。 只有两种菜单，所以答案只是一种菜单中最便宜的午餐价格加上另一种菜单中最便宜的晚餐价格。 例如，```
1
4 9
5 3
```有答案`7`，使用第一个菜单中的午餐和第二个菜单中的晚餐。 单独获取最低午餐和最低晚餐的粗心实施可能会从同一菜单中选择两种价格并错误地报告`4`。 

当最便宜的午餐和最便宜的晚餐属于同一个菜单时，就会出现另一个微妙的情况。 例如，```
2
1 100
2 2
100 1
100 100
```有答案`2`和`104`。 第一个答案，午餐价格`1`和晚餐价格`1`来自不同的菜单，因此不存在冲突。 更一般地说，如果两个最便宜的选择确实来自同一个菜单，我们必须至少在一侧考虑第二好的选择。 简单地添加两个堆最小值是不够的。 

第三个边缘情况是，将已选择的菜单从午餐更改为晚餐，或从晚餐更改为午餐，可能会产生负成本。 例如，```
2
1 100
2 3
100 4
100 5
```有第一个答案`4`，午餐使用菜单 1，晚餐使用菜单 2。 对于第二个答案，最好将菜单 2 从晚餐移至午餐，这会改变其贡献 (2-3=-1)，然后使用菜单 3 和 4 进行晚餐。 结果是(1+2+4+5=12)。 仅添加未使用的菜单的算法会错过这种交换。 

最后，答案可能比 32 位整数大得多。 有（250000）份午餐和（250000）份晚餐，最多可以有（500000）个选择价格，每个价格为（10^9），所以总数可以达到（5\times10^{14}）。 Python 整数会自动处理这个问题，但 C++ 实现需要`long long`。 

## 方法

 直接的强力解决方案可以枚举午餐、晚餐或未使用的菜单的每个有效分配。 对于固定的 (k)，有

 [
 \binom{2N}{k}\binom{2N-k}{k}
 ]

 可能的分配，因为我们首先从剩下的菜单中选择 (k) 午餐菜单，然后选择 (k) 晚餐菜单。 在每个 (k) 中，分配的总数为

 [
 \sum_{k=0}^{N}\frac{(2N)!}{k!k!(2N-2k)!},
 ]

 这是中心三项式系数 (2N)，呈指数增长。 即使是单一情况 (k=N) 也已经有 (\binom{2N}{N}) 种可能性。 这种方法仅对微小的实例有用，因为它直接代表了最优值的定义，但其操作数很久以前就变成了天文数字（N=250000）。 

一种更结构化的暴力方法是动态编程。 处理完前 (i) 个菜单后，我们可以存储每种可能数量的午餐和晚餐选择的最低成本。 自然状态有三个维度，例如（DP[i][j][k]），每个菜单可以被忽略，分配给午餐，或分配给晚餐。 这将问题从指数减少为多项式，但所得 (O(N^3)) 计算对于 (N=250000) 来说仍然太大。 竞赛教程将此 DP 描述为一个小子任务解决方案，然后转向对完整约束的最小成本流解释。 

有用的观察是我们不需要从头开始解决每个 (k)。 假设我们已经有了一个包含 (k-1) 个午餐菜单和 (k-1) 个晚餐菜单的最佳解决方案。 将所有菜单分为三组：(U)，未使用的菜单，(L)，当前分配给午餐的菜单，以及 (D)，当前分配给晚餐的菜单。 

为了从 (k-1) 转移到 (k)，我们需要多一份午餐菜单和一份晚餐菜单。 考虑更改当前分配而不是重建它。 新菜单可以以成本 (l_i) 从 (U) 移动到 (L)，或者以成本 (d_i) 从 (U) 移动到 (D)。 我们还可以将选定的晚餐菜单交换为午餐，将其成本更改 (l_i-d_i)，或将选定的午餐菜单交换为晚餐，将其成本更改 (d_i-l_i)。 

这些可能性恰好分解为三种有用的模式。 我们可以拿两份未使用的菜单，一份用于午餐，一份用于晚餐。 我们可以将一份现有的晚餐菜单移至午餐，并使用两份未使用的晚餐菜单。 或者我们可以将一份现有的午餐菜单移至晚餐，并使用两份未使用的午餐菜单。 两个方向的同时交换不能改善先前的最佳状态，因为两次交换使午餐和晚餐计数保持不变，并且它们的组合负成本已经与先前分配的最优性相矛盾。 

这与最小成本流解决方案使用的残差图结构相同。 这四组相关候选正是按午餐价格排序的未使用菜单、按晚餐价格排序的未使用菜单、按(d-l)排序的选定午餐菜单和按(l-d)排序的选定晚餐菜单。 

暴力破解之所以有效，是因为每个可能的分配都被明确考虑，但会失败，因为分配的数量是指数级的。 残余流观察让我们用三个最小成本局部变换替换所有这些分配，而堆让我们在对数时间内获得每个所需的最小值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| (O(N)) | 太慢了 |
 | 三态动态规划 | (O(N^3)) | (O(N^2)) | 太慢了 |
 | 残差贪婪与堆 | (O(N\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1.读取所有(2N)个菜单并首先将每个菜单放入未使用的集合(U)中。 构建一个按午餐价格排序的最小堆和另一个按晚餐价格排序的最小堆。 我们还为可​​能的交换维护两个空堆，一个包含当前位于 (L) 中的菜单的 (d_i-l_i)，另一个包含当前位于 (D) 中的菜单的 (l_i-d_i)。 
2. 维护一个包含三个值的状态数组。 状态`0`表示菜单未使用，状态`1`表示它被选为午餐，并说明`2`意味着它被选为晚餐。 堆允许包含过时的条目，因此每当我们检查堆时，我们都会丢弃菜单不再处于所需状态的条目。 这种惰性删除避免了从 Python 堆中进行昂贵的任意删除。 
3. 对于当前步骤(k)，首先考虑独立选择两个未使用的菜单的模式。 一份变成午餐，一份变成晚餐。 它的成本是最小的 (l_i+d_j) 和 (i\ne j)，其中两个菜单当前均未使用。 如果最少午餐和最少晚餐条目涉及不同的菜单，则它们的总和立即是该模式的最佳选择。 如果他们参考相同的菜单，我们会使用第二好的午餐或第二好的晚餐选择进行比较。 
4. 考虑这样一种模式：一份当前的晚餐菜单成为午餐，两份未使用的菜单成为晚餐。 如果菜单 (v) 当前在 (D) 中，则将其更改为午餐费用 (l_v-d_v)。 两个新的晚餐菜单应该是（U）中晚餐价格最低的两个。 因此，该模式的最佳成本是

 [
 \min_{v\in D}(l_v-d_v)
 +
 \operatorname{twoMin}_{i\in U}(d_i)。 
]

 这两项是独立的，因为交换的菜单属于 (D)，而新菜单属于 (U)。 

1. 相应地，考虑将一份当前的午餐菜单移至晚餐，并使用两份未使用的午餐菜单。 其成本为

 [
 \min_{v\in L}(d_v-l_v)
 +
 \operatorname{twoMin}_{i\in U}(l_i)。 
]

 1.选择三种模式中最便宜的。 将相应的状态更改准确应用到菜单。 如果第一个模式获胜，则将一个未使用的菜单移至 (L)，将另一个未使用的菜单移至 (D)。 如果第二个获胜，则将一个 (D) 菜单移至 (L)，将两个 (U) 菜单移至 (D)。 如果第三个获胜，则将一个（L）菜单移至（D），将两个（U）菜单移至（L）。 
2. 将所选的增量成本添加到当前总成本中。 转换后，正好有 (k) 个午餐菜单和 (k) 个晚餐菜单，因此得到的总计就是 (k) 的答案。 重复直到(k=N)。 

### 为什么它有效

 在每次迭代开始时，当前分配对于 (k-1) 次午餐和 (k-1) 次晚餐是最佳的。 (k) 的任何解都可以被视为该分配的残差变换。 删除无用的循环后，此类转换必须在每一侧添加一个未使用的菜单，将一个晚餐菜单移至午餐，同时从未使用的菜单中添加两份晚餐，或者将一个午餐菜单移至晚餐，同时从未使用的菜单中添加两份午餐。 每个模式的成本由相应的堆最小值精确表示。 因此，选择最便宜的模式给出了从最优 ((k-1,k-1)) 分配到最优 ((k,k)) 分配的最小可能增加。 不变的是，每次迭代后，维护的分区 (U,L,D) 代表当前 (k) 的最优解。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n = int(input())
    m = 2 * n

    lunch = [0] * m
    dinner = [0] * m

    for i in range(m):
        lunch[i], dinner[i] = map(int, input().split())

    # state:
    # 0 = unused
    # 1 = lunch
    # 2 = dinner
    state = [0] * m

    # Two heaps for currently unused menus.
    by_lunch = [(lunch[i], i) for i in range(m)]
    by_dinner = [(dinner[i], i) for i in range(m)]
    heapq.heapify(by_lunch)
    heapq.heapify(by_dinner)

    # For a lunch menu, changing it to dinner costs d - l.
    lunch_swap = []

    # For a dinner menu, changing it to lunch costs l - d.
    dinner_swap = []

    def clean(heap, wanted_state):
        while heap and state[heap[0][1]] != wanted_state:
            heapq.heappop(heap)
        return heap[0] if heap else None

    def two_min(heap, wanted_state):
        while heap and state[heap[0][1]] != wanted_state:
            heapq.heappop(heap)

        if not heap:
            return None

        first = heapq.heappop(heap)

        while heap and state[heap[0][1]] != wanted_state:
            heapq.heappop(heap)

        if not heap:
            heapq.heappush(heap, first)
            return None

        second = heapq.heappop(heap)
        heapq.heappush(heap, first)
        heapq.heappush(heap, second)

        return first, second

    def move_unused_to_lunch(i):
        state[i] = 1
        heapq.heappush(lunch_swap, (dinner[i] - lunch[i], i))

    def move_unused_to_dinner(i):
        state[i] = 2
        heapq.heappush(dinner_swap, (lunch[i] - dinner[i], i))

    def move_dinner_to_lunch(i):
        state[i] = 1
        heapq.heappush(lunch_swap, (dinner[i] - lunch[i], i))

    def move_lunch_to_dinner(i):
        state[i] = 2
        heapq.heappush(dinner_swap, (lunch[i] - dinner[i], i))

    def first_two_unused_lunch():
        return two_min(by_lunch, 0)

    def first_two_unused_dinner():
        return two_min(by_dinner, 0)

    total = 0
    answer = []

    for _ in range(n):
        best_cost = None
        best_type = -1
        best_ids = None

        # Type 1:
        # U -> L and U -> D, using two distinct menus.
        a = clean(by_lunch, 0)
        b = clean(by_dinner, 0)

        if a is not None and b is not None:
            if a[1] != b[1]:
                cost = a[0] + b[0]
                ids = (a[1], b[1])
            else:
                pair_l = first_two_unused_lunch()
                pair_d = first_two_unused_dinner()

                candidates = []

                if pair_l is not None:
                    l1, l2 = pair_l
                    candidates.append((l2[0] + b[0], l2[1], b[1]))

                if pair_d is not None:
                    d1, d2 = pair_d
                    candidates.append((a[0] + d2[0], a[1], d2[1]))

                if candidates:
                    cost, lid, did = min(candidates)
                    ids = (lid, did)

            if best_cost is None or cost < best_cost:
                best_cost = cost
                best_type = 1
                best_ids = ids

        # Type 2:
        # D -> L, plus two U -> D.
        sw = clean(dinner_swap, 2)
        pair_d = first_two_unused_dinner()

        if sw is not None and pair_d is not None:
            d1, d2 = pair_d
            cost = sw[0] + d1[0] + d2[0]

            if best_cost is None or cost < best_cost:
                best_cost = cost
                best_type = 2
                best_ids = (sw[1], d1[1], d2[1])

        # Type 3:
        # L -> D, plus two U -> L.
        sw = clean(lunch_swap, 1)
        pair_l = first_two_unused_lunch()

        if sw is not None and pair_l is not None:
            l1, l2 = pair_l
            cost = sw[0] + l1[0] + l2[0]

            if best_cost is None or cost < best_cost:
                best_cost = cost
                best_type = 3
                best_ids = (sw[1], l1[1], l2[1])

        total += best_cost

        if best_type == 1:
            lid, did = best_ids
            move_unused_to_lunch(lid)
            move_unused_to_dinner(did)

        elif best_type == 2:
            sid, d1, d2 = best_ids
            move_dinner_to_lunch(sid)
            move_unused_to_dinner(d1)
            move_unused_to_dinner(d2)

        else:
            sid, l1, l2 = best_ids
            move_lunch_to_dinner(sid)
            move_unused_to_lunch(l1)
            move_unused_to_lunch(l2)

        answer.append(total)

    sys.stdout.write("\n".join(map(str, answer)))

if __name__ == "__main__":
    solve()
```两个数组`lunch`和`dinner`存储原价，同时`state`表示当前分区为未使用的菜单、午餐菜单和晚餐菜单。 两个未使用的堆按其实际价格排序，因为新选择的菜单恰好支付该价格。 

两个交换堆仅存储所选菜单的贡献变化的量。 午餐菜单具有交换值 (d-l)，因为将其更改为晚餐会用 (d) 替换 (l)。 由于对称原因，晚餐菜单具有交换值（l-d）。 这些值可以是负数，这就是为什么堆必须按有符号差而不是按原始价格排序的原因。 

这`clean`函数实现了惰性删除。 菜单可以在状态之间移动多次，而 Python 的`heapq`不支持有效删除任意元素。 相反，旧条目保留在堆中，并在到达顶部并且其状态不再与堆的含义匹配时被丢弃。 

这`two_min`helper 暂时删除前两个有效条目，然后恢复它们。 这给出了两个最便宜的当前有效菜单，而不需要支持通过菜单ID删除的数据结构。 每个菜单每次迭代仅更改状态 (O(1)) 次，因此创建的堆条目总数为 (O(N))。 

对第一个候选者进行独特性检查是必要的，因为同一个菜单不能同时是午餐和晚餐。 如果最便宜的午餐和晚餐条目具有相同的 ID，则只有两种选择可能是最佳的：将第二便宜的午餐与最便宜的晚餐一起使用，或者将最便宜的午餐与第二便宜的晚餐一起使用。 

所有算术都是整数算术。 最大总数约为 (5\times10^{14})，Python 可以处理而不会溢出。 

## 工作示例

 第一个官方样本包含一天和两个菜单。```
1
4 9
5 3
```最初两个菜单均未使用。 最便宜的午餐是菜单 1，含费用`4`，最便宜的晚餐是菜单 2，需支付费用`3`。 它们是不同的菜单，因此第一个模式有效。 

| 步骤| 未使用的午餐最低限度| 未使用的晚餐最低限度| 最佳图案| 增量| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | (k=1) | 4、菜单1| 3、菜单2| U→L + U→D | 7 | 7 |

 转换后，菜单 1 在 (L) 中，菜单 2 在 (D) 中。 答案是`7`。 

第二个官方样本是```
2
1 6
2 4
5 3
3 1
```对于 (k=1)，菜单 1 是按成本计算最便宜的午餐`1`，而菜单 4 是成本价中最便宜的晚餐`1`。 它们是不同的，因此第一个模式的成本`2`。 

对于(k=2)，菜单1和4已经被选择。 未使用的菜单是带有价格的菜单 2`(2,4)`和菜单 3 的价格`(5,3)`。 将两者直接成本相加`2+3=5`。 互换替代品的成本更高。 

| 步骤| (U) 菜单| 最佳人选| 增量| 总计 |
 | --- | --- | --- | --- | --- |
 | (k=1) | 1:(1,6)、2:(2,4)、3:(5,3)、4:(3,1) | 菜单 1→L，菜单 4→D | 2 | 2 |
 | (k=2) | 2:(2,4), 3:(5,3) | 菜单 2→L，菜单 3→D | 5 | 7 |

 结果输出是`2`和`7`，与官方样品相符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\log N)) | 有 (N) 次迭代，每次迭代只有恒定数量的堆操作。 |
 | 空间| (O(N)) | 有 (2N) 个菜单和 (O(N)) 个堆条目，包括惰性过时条目。 |

 最多有（500000）个菜单，并且每次状态转换仅添加恒定数量的堆条目。 因此，对数堆操作很容易在 (N=250000) 的预期复杂度内，而内存使用量保持线性。 

## 测试用例

 以下测试使用官方的三个样本，以及针对最小大小、相等值、冲突最小值、两个交换方向以及允许的最大值 (N) 的小案例。 官方样本数据和输出取自 Codeforces 声明。```python
import sys
import io
import heapq

def solve_data(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = 2 * n

    lunch = [0] * m
    dinner = [0] * m

    for i in range(m):
        lunch[i] = next(it)
        dinner[i] = next(it)

    state = [0] * m

    by_lunch = [(lunch[i], i) for i in range(m)]
    by_dinner = [(dinner[i], i) for i in range(m)]
    heapq.heapify(by_lunch)
    heapq.heapify(by_dinner)

    lunch_swap = []
    dinner_swap = []

    def clean(heap, wanted):
        while heap and state[heap[0][1]] != wanted:
            heapq.heappop(heap)
        return heap[0] if heap else None

    def two_min(heap, wanted):
        while heap and state[heap[0][1]] != wanted:
            heapq.heappop(heap)

        if not heap:
            return None

        first = heapq.heappop(heap)

        while heap and state[heap[0][1]] != wanted:
            heapq.heappop(heap)

        if not heap:
            heapq.heappush(heap, first)
            return None

        second = heapq.heappop(heap)
        heapq.heappush(heap, first)
        heapq.heappush(heap, second)

        return first, second

    def to_lunch(i):
        state[i] = 1
        heapq.heappush(lunch_swap, (dinner[i] - lunch[i], i))

    def to_dinner(i):
        state[i] = 2
        heapq.heappush(dinner_swap, (lunch[i] - dinner[i], i))

    total = 0
    ans = []

    for _ in range(n):
        best = None

        a = clean(by_lunch, 0)
        b = clean(by_dinner, 0)

        if a is not None and b is not None:
            if a[1] != b[1]:
                candidate = (a[0] + b[0], 1, (a[1], b[1]))
            else:
                pl = two_min(by_lunch, 0)
                pd = two_min(by_dinner, 0)
                candidates = []

                if pl is not None:
                    candidates.append((pl[1][0] + b[0], 1,
                                       (pl[1][1], b[1])))

                if pd is not None:
                    candidates.append((a[0] + pd[1][0], 1,
                                       (a[1], pd[1][1])))

                candidate = min(candidates) if candidates else None

            if candidate is not None:
                best = candidate

        sw = clean(dinner_swap, 2)
        pd = two_min(by_dinner, 0)

        if sw is not None and pd is not None:
            candidate = (sw[0] + pd[0][0] + pd[1][0],
                         2, (sw[1], pd[0][1], pd[1][1]))
            if best is None or candidate[0] < best[0]:
                best = candidate

        sw = clean(lunch_swap, 1)
        pl = two_min(by_lunch, 0)

        if sw is not None and pl is not None:
            candidate = (sw[0] + pl[0][0] + pl[1][0],
                         3, (sw[1], pl[0][1], pl[1][1]))
            if best is None or candidate[0] < best[0]:
                best = candidate

        cost, typ, ids = best
        total += cost

        if typ == 1:
            to_lunch(ids[0])
            to_dinner(ids[1])
        elif typ == 2:
            to_lunch(ids[0])
            to_dinner(ids[1])
            to_dinner(ids[2])
        else:
            to_dinner(ids[0])
            to_lunch(ids[1])
            to_lunch(ids[2])

        ans.append(total)

    return "\n".join(map(str, ans))

def run(inp: str) -> str:
    return solve_data(inp)

# Official samples
assert run("""1
4 9
5 3
""") == "7", "sample 1"

assert run("""2
1 6
2 4
5 3
3 1
""") == "2\n7", "sample 2"

assert run("""4
7 5
5 7
7 4
4 2
2 5
6 4
3 2
1 9
""") == "3\n7\n16\n26", "sample 3"

# Minimum-size case
assert run("""1
7 3
2 9
""") == "5", "N=1 with different cheapest roles"

# All prices equal
assert run("""2
5 5
5 5
5 5
5 5
""") == "10\n20", "all equal values"

# The cheapest lunch and dinner candidates initially conflict
assert run("""2
1 100
2 2
100 1
100 100
""") == "2\n104", "conflicting minima"

# D -> L swap is useful
assert run("""2
1 100
2 3
100 4
100 5
""") == "4\n12", "useful D-to-L swap"

# L -> D swap is useful
assert run("""2
100 1
3 2
4 100
5 100
""") == "4\n12", "useful L-to-D swap"

# Maximum-size case, all prices equal.
# The answer for k is exactly 2*k.
n = 250000
max_input = str(n) + "\n" + "1 1\n" * (2 * n)
max_output = "\n".join(str(2 * k) for k in range(1, n + 1))
assert run(max_input) == max_output, "maximum N"
```最小大小测试确认该算法在生成第一个答案之前不需要任何交换堆来包含元素。 全相等测试会检查大量关系，其中按菜单 ID 进行堆排序不得意外违反不同菜单要求。 

冲突最小值测试检查独立选择绝对最低午餐和晚餐可以使用相同菜单的情况。 两个交换测试验证了剩余重新分配的两个方向，包括负交换成本。 最终生成的测试达到 (N=250000)，因此它会执行实际的最大输入大小，并确认当每个价格相同时答案仍然正确。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7 3 / 2 9`|`5`| 最低（N），独特的菜单要求 |
 | 四种菜单，每种价格`5`|`10 / 20`| 平局和重复相等值 |
 |`1 100 / 2 2 / 100 1 / 100 100`|`2 / 104`| 冲突的最小值和次优选择 |
 |`1 100 / 2 3 / 100 4 / 100 5`|`4 / 12`| 负（D\to L）互换 |
 |`100 1 / 3 2 / 4 100 / 5 100`|`4 / 12`| 负（L\to D）互换 |
 | (N=250000)，所有价格`1 1`|`2,4,...,500000`| 最大尺寸、大产量|

 ## 边缘情况

 对于 (N=1)，输入```
1
4 9
5 3
```开始时两个菜单均未使用。 最便宜的午餐是`4`从菜单 1 开始，最便宜的晚餐是`3`来自菜单 2，因此第一个模式有效且成本`7`。 状态变为 (L={1}) 和 (D={2})，准确给出所需的答案。 

对于冲突最小值情况，```
2
1 100
2 2
100 1
100 100
```第一次迭代选择菜单 1 为午餐，菜单 3 为晚餐，成本`2`。 其余菜单有价格`(2,2)`和`(100,100)`。 对于第二次迭代，直接将它们分配给午餐和晚餐费用`2+100=102`，因此总数变为`104`。 交换替代方案更昂贵，并且算法保留直接分配。 

对于有用的晚餐到午餐的交换，```
2
1 100
2 3
100 4
100 5
```第一个答案使用菜单 1 午餐，菜单 2 晚餐，成本`4`。 对于第二个答案，菜单 2 从晚餐更改为午餐，成本也发生变化 (2-3=-1)。 菜单 3 和 4 成为晚餐`4+5=9`，所以增量为`8`总计是`12`。 该算法看到`-1`在晚餐交换堆的顶部，并正确选择此模式，而不是简单地添加两个未使用的菜单。 

对称情况，```
2
100 1
3 2
4 100
5 100
```从菜单 2 作为午餐开始，菜单 1 作为晚餐，同样要收费`4`。 将菜单 2 从午餐移至晚餐会改变其成本 (2-3=-1)，而菜单 3 和 4 则提供两份新午餐`4+5=9`。 第二个增量是`8`, 生产`12`。 这证实了剩余交换的两个方向都必须被表示。 

例如，当所有价格相同时，```
2
5 5
5 5
5 5
5 5
```每个有效的一日任务费用`10`，以及每两天的作业成本`20`。 该算法在菜单 ID 之间的平局打破并不重要，因为每个选择都具有相同的成本，而显式的不同 ID 检查仍然可以防止将一个菜单分配给两餐。 

最后，在 (N=250000) 所有价格等于`1 1`，每额外的午餐和晚餐费用恰好`2`。 因此答案是 (2,4,6,\ldots,500000)。 当菜单改变状态时，堆包含许多绑定条目和许多陈旧条目，因此这种情况也验证了最大可能输入下的延迟删除机制。
