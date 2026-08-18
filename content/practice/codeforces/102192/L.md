---
title: "CF 102192L - 从 ICPC 到 ACM"
description: "我们有一家工厂运营了 (k) 个月。 在第 (i) 个月，每单位原材料成本为 (ci)，生产一台计算机的成本为另一台计算机 (mi)，生产限制为 (pi)，并且必须准确交付 (di) 台计算机。"
date: "2026-08-18T02:19:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "L"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 228
verified: true
draft: false
---

[CF 102192L - 从 ICPC 到 ACM](https://codeforces.com/problemset/problem/102192/L)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一家工厂运营了 (k) 个月。 在第 (i) 个月，每单位原材料成本为 (c_i)，生产一台计算机的成本为另一台计算机 (m_i)，生产限制为 (p_i)，并且必须准确交付 (d_i) 台计算机。 原材料的存储不受容量限制，而成品计算机只能从第 (i) 个月到第 (i+1) 个月跨境运输，数量最多为 (e_i)。 

有两个独立的存储成本。 在一个月内保留一单位原材料的成本 (R_i)，在相同边界内保留一台成品计算机的成本 (E_i)。 同月生产和销售的计算机不支付任何存储费用。 最初两个库存都是空的。 

目标是选择何时购买原材料、何时制造计算机以及使用哪家制造的计算机来满足每月的需求，以便以最低的总成本满足每个需求。 如果由于生产能力和成品库存不足而无法满足某些需求，则答案为（-1）。 

输入在一个测试用例中最多包含 (50,000) 个月，所有测试用例的 (k) 之和最多为 (300,000)。 考虑每对月份的方法已经太大了，因为 (50,000^2/2) 约为 (1.25\times10^9)。 更严重的是，(p_i) 和 (d_i) 都可以是 (10^4)，因此逐个单元的实现可以在一个测试用例中处理多达 (50,000\times10^4=5\times10^8) 台计算机。 解决方案必须取决于月数，而不是计算机总数。 

第一个微妙之处是，第 (i) 个月的生产最便宜的原材料不一定必须在第 (i) 个月购买。 例如，```
1
2
1 0 0 0
100 1 0 1
1 1 0
```有答案（2）。 第2个月使用的原材料可以在第1个月以(1)元购买并另外以(1)元存储。 始终使用 (c_i) 作为材料价格的解决方案将支付 (100)。 

第二个微妙之处是成品存储容量适用于月份之间，而不是当月临时生产的计算机数量。 例如，```
1
2
0 0 0 2
0 2 0 0
1 0 0
```有答案（-1）。 第一个月可以生产两台电脑，但第二个月只能生产一台。 由于第二个月无法制造任何东西，因此要求两个月是不可能的。 将所有未使用的生产保留在其数据结构中而不应用边界容量的粗心实现将错误地找到可行的计划。 

第三个微妙之处是，每次跨越边界都必须收取存储成本。 例如，```
1
2
1 0 0 1
100 1 0 1
1 1 2
```有答案（3）。 第 1 个月生产的计算机成本为 (1)，然后在存储时成本为 (2)，因此在第 2 个月出售时成本为 (3)。在计算机插入时而不是在实际跨越边界时收取存储费很容易产生差一错误。 

## 方法

 一种直接的方法是对每台计算机进行推理。 每个月，我们最多可以创建 (p_i) 台候选计算机，存储其当前成本，采用最便宜的 (d_i) 台计算机来满足当前需求，并在超出仓库容量时删除最昂贵的计算机。 这在概念上是正确的，因为除了生产和存储能力之外，每台计算机都是独立的。 

问题在于候选人的数量。 一个测试用例可以包含 (50,000) 个月，其中 (p_i=10,000)，给出 (5\times10^8) 台候选计算机。 即使堆在对数时间内处理每次插入，也将需要数亿次堆操作。 如果我们尝试单独模拟每个需求单位，也会出现同样的问题。 

第一个观察结果完全消除了原材料库存。 令 (q_i) 为获得第 (i) 个月可供使用的一单位原材料的最便宜的可能成本。 要么我们在第 (i) 个月以 (c_i) 的价格购买它，要么我们在第 (i-1) 个月提供它并支付 (R_{i-1}) 来存储它。 因此

 [
 q_1=c_1
 ]

 对于 (i>1)，

 [
 q_i=\min(c_i,q_{i-1}+R_{i-1})。 
]

 由于原材料容量是无限的，因此不同单元之间不存在相互作用。 我们可以独立假设第 (i) 个月制造的每台计算机均按成本 (q_i) 使用原材料。 那么它的制造成本就是

 [
 w_i=q_i+m_i。 
]

 剩下的问题仅与成品计算机有关。 第 (i) 个月制造的计算机的当前成本为 (w_i)。 如果它在仓库里多呆一个月，它的成本就会增加(E_i)。 因此，当时间提前一个月时，当前存储中的每台计算机都会收到完全相同的额外成本。 

这种共同的附加成本是贪婪解决方案的关键。 在月初，将本月可以制造的计算机按照当前总成本放入一个集合中。 然后使用最便宜的计算机来满足当前的需求。 满足需求后，只有 (e_i) 台计算机可以存活到下个月，因此保留最便宜的 (e_i) 并丢弃最昂贵的计算机。 

事实上，我们可以在概念上插入所有 (p_i) 可能的计算机，这一事实值得关注。 它们是候选者，不一定是实际制造出来的计算机。 如果某个候选人因为保留成本太高而被丢弃，我们简单地将其解释为从未制造该计算机。 只有最终出售的候选人才能将其制造和材料成本贡献给答案。 

为什么当前的需求要使用最便宜的电脑？ 假设两台可用计算机具有当前成本 (a<b)，但所谓的最优方案现在出售计算机成本 (b) 并保留计算机成本 (a)。 如果以后不再使用更便宜的计算机，则立即更换它们可以改善解决方案。 如果稍后使用较便宜的计算机，请交换角色：现在出售较便宜的计算机，并在未来相同的时期内保留较昂贵的计算机。 两台计算机未来的存储成本相同，因此（a）到（b）的差异永远不会通过保留较便宜的一台来弥补。 现在卖掉更便宜的电脑至少也一样好。 

同样的支配论点也适用于仓库边界。 如果在满足需求后剩下两台计算机，并且其中一台的成本低于另一台，那么保留昂贵的一台而丢弃便宜的一台永远不会有帮助，因为未来的每个月都会为两台计算机增加相同的存储成本。 昂贵的计算机占据主导地位。

这正是竞赛材料中描述的贪婪模拟：计算最便宜的有效原材料价格，按当前成本维护成品计算机，出售最便宜的计算机，并在到达仓库边界时丢弃最昂贵的计算机。 

剩下的实施挑战是许多计算机可能具有相同的成本。 因此，我们将每个生产月份存储为一批，并包含成本和数量，而不是在每台计算机上插入一个堆元素。 最小堆提供最便宜的销售批次，最大堆提供最昂贵的容量调整批次。 每个批次在每个堆中最多包含一个堆条目，无论其数量是多少。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((\sum p_i)\log(\sum p_i))) | (O(\sum p_i)) | 太慢了|
 | 最佳| (O(k\log k)) | (O(k)) | 已接受 |

 ## 算法演练

 1. 读取 (k) 月度生产和需求数据，然后读取 (k-1) 仓库转换。 我们在模拟月份之前需要转换数据，因为输入首先放置所有月份数据。 
2. 维护`raw_cost`，当月一单位原材料可用的最便宜价格。 第一个月是 (c_1)。 之后计算
 [
 \text{raw_cost}=\min(c_i,\text{raw_cost}+R_{i-1})。 
]
 这是可行的，因为原材料存储没有容量限制，因此两个原材料单元没有理由争夺空间。 
3. 保持全局`offset`代表在上个月边界内幸存下来的所有计算机累积的成品计算机存储成本。 计算机的实际成本是其存储的堆密钥加上`offset`。 当从 (i) 月移动到 (i+1) 月时，增加`offset`由(E_i)。 向每台计算机添加相同的值不会改变它们的顺序。 
4. 在 (i) 月，创建一个批次，最多包含 (p_i) 台候选计算机。 其实际生产成本为
 [
 \text{raw_cost}+m_i。 
]
 存储标准化密钥
 [
 \text{key}=\text{raw_cost}+m_i-\text{offset}。 
]
然后`key + offset`始终是计算机当前的实际成本。 
5. 检查可用候选计算机的数量是否至少为(d_i)。 如果不是，则不可能满足当前需求，因此返回(-1)。 
6. 从最小成本堆中恰好删除 (d_i) 台计算机。 对于每个批次，根据需要删除尽可能多的计算机，将该数量乘以`key + offset`，并将结果添加到答案中。 如果仅售出一批批次的一部分，则将减少的数量放回堆中。 
7. 如果这不是最后一个月，则将剩余库存与 (e_i) 进行比较。 如果剩余多于 (e_i) 台计算机，则从最大成本堆中删除计算机，直到剩余 (e_i) 台计算机。 这些被丢弃的候选者被解释为从未制造过的计算机。 
8. 增加`offset`在处理下个月之前通过 (E_i)。 每台跨越此边界的计算机都必须支付此存储成本。 

### 为什么它有效

 不变量是，在处理第 (i) 个月之后，堆准确地代表了在未来几个月中仍然有用的最便宜的成品计算机候选集，最多允许的数量跨越当前仓库边界。 对于当前的需求，用更便宜的可用计算机替换任何选定的昂贵计算机不会使未来的计划变得更糟，因为未来的存储量会给两者增加相同的数量。 在仓库边界，保留一台更便宜的计算机而不是一台更昂贵的计算机也总是至少同样好。 原材料循环是独立最优的，因为无限的原材料存储使每个单位选择最便宜的生产月份路径。 这三个优势属性一起意味着每个贪婪的选择都可以转换为最优解决方案，而不会增加其成本。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        k = int(input())

        c = [0] * k
        d = [0] * k
        m = [0] * k
        p = [0] * k

        for i in range(k):
            c[i], d[i], m[i], p[i] = map(int, input().split())

        e = [0] * (k - 1)
        R = [0] * (k - 1)
        E = [0] * (k - 1)

        for i in range(k - 1):
            e[i], R[i], E[i] = map(int, input().split())

        min_heap = []
        max_heap = []

        # remaining[id] is the number of computers left in batch id.
        remaining = []

        raw_cost = 0
        offset = 0
        total_inventory = 0
        answer = 0
        possible = True

        for i in range(k):
            # Computers carried from the previous month have just paid
            # the storage cost on the boundary before month i.
            if i > 0:
                offset += E[i - 1]

                raw_cost = min(c[i], raw_cost + R[i - 1])
            else:
                raw_cost = c[i]

            # This is a candidate batch, not necessarily an actually
            # manufactured batch. Discarding it later means we never
            # needed to manufacture those computers.
            if p[i] > 0:
                batch_id = len(remaining)
                remaining.append(p[i])

                key = raw_cost + m[i] - offset

                heapq.heappush(min_heap, (key, batch_id))
                heapq.heappush(max_heap, (-key, batch_id))

                total_inventory += p[i]

            if total_inventory < d[i]:
                possible = False
                break

            need = d[i]

            # Sell the cheapest available computers.
            while need > 0:
                while min_heap and remaining[min_heap[0][1]] == 0:
                    heapq.heappop(min_heap)

                key, batch_id = heapq.heappop(min_heap)

                take = min(need, remaining[batch_id])
                answer += take * (key + offset)

                remaining[batch_id] -= take
                total_inventory -= take
                need -= take

                if remaining[batch_id] > 0:
                    heapq.heappush(min_heap, (key, batch_id))

            # Only computers crossing to the next month occupy the
            # finished-goods warehouse.
            if i < k - 1 and total_inventory > e[i]:
                remove = total_inventory - e[i]

                # Discard the most expensive computers.
                while remove > 0:
                    while max_heap and remaining[max_heap[0][1]] == 0:
                        heapq.heappop(max_heap)

                    neg_key, batch_id = heapq.heappop(max_heap)
                    key = -neg_key

                    take = min(remove, remaining[batch_id])
                    remaining[batch_id] -= take
                    total_inventory -= take
                    remove -= take

                    if remaining[batch_id] > 0:
                        heapq.heappush(max_heap, (neg_key, batch_id))

        out.append(str(answer) if possible else "-1")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```首先读取每月数组，因为仓库转换出现在输入中的所有每月记录之后。 然后，模拟可以从左到右处理月份。`raw_cost`在创建当前生产批次之前更新。 表达式`raw_cost + R[i - 1]`代表更早购买原材料并携带它越过之前的边界。 直接的替代方案是`c[i]`，因此取最小值可以得到最便宜的材料成本。 

这`offset`约定避免在添加存储费用时修改每个堆元素。 假设使用标准化密钥插入了一批`key`。 当月的实际成本始终为`key + offset`。 增加`offset`将所有实际成本更改相同的量，因此两个堆排序仍然有效。 

每个生产月最多创建一批。 批次 ID 允许两个堆引用相同的数量，而无需复制数量本身。 最小堆包含`(key, id)`，而最大堆包含`(-key, id)`。 对键取反会将 Python 的最小堆转换为最大堆。 

批次可以根据需求或容量调整来部分消耗。 当这种情况发生时，减少的数量将被推回原来被删除的堆中。 另一个堆仍然包含相同的批次 ID 并从中读取当前数量`remaining`，因此只要过时的条目数量达到零，就可以忽略它们。 

增加当前产能后立即进行可行性检查。 如果`total_inventory < d[i]`，未来的任何一个月都无法满足本月的需求，因此返回`-1`是安全的。 

所有成本计算都使用Python整数，因此不存在溢出问题。 在具有固定宽度整数的语言中，答案应存储在 64 位整数中。 最大可能的答案正好高于 32 位范围。 

## 工作示例

 官方示例由两个测试用例组成。 第一个有两个月，第一个月可以生产六台计算机，第二个月可以生产八台。 第一个月便宜的原材料值得储存，成品仓库可以装两台电脑过关。 官方输出为（170）。 

### 示例 1

 第一个测试用例的输入是```
2
10 5 3 6
15 7 2 8
2 3 2
```第 1 个月的有效原材料成本为 (10)。 在第 2 个月，它变为 (\min(15,10+3)=13)。 因此生产成本为（13）和（15）。 

| 月 | 原材料成本| 偏移| 生产成本| 候选人数 | 已售 | 库存售后| 产能 | 回答 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 10 | 10 0 | 13 | 6 | 5 | 1 | 2 | 65 | 65
 | 2 | 13 | 2 | 15 | 15 9 | 7 | 2 | 决赛| 170 | 170

 在第 1 个月末，一台计算机仍处于存储状态。 越过边界会增加(E_1=2)，因此计算机的成本变为(15)。 在第 2 个月，新生产的计算机的成本也是 (15)，因此所有七台所需的计算机每台都可以按成本 (15) 购买。 总数为(5\times13+7\times15=170)。 

此跟踪还显示了为什么必须在几个月之间应用存储成本。 第一个月剩余的计算机的生产成本为 (13)，但第二个月使用时的成本为 (13+2=15)。 

### 示例 2

 第二个测试用例是```
2
0 8 0 7
0 0 0 0
0 0 0
```第一个月的产能为（7），而需求为（8）。 

| 月 | 原材料成本| 生产能力| 需求| 售前可用 | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 7 | 8 | 7 | 不可能|
 | 2 | 0 | 0 | 0 | 未达到| 未处理 |

 该算法检测到`total_inventory < d[0]`立即并返回 (-1)。 等待第二个月也无济于事，因为第一个月需要缺少的八台计算机。 这正是官方样本所显示的不可行性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(k\log k)) | 每月最多插入一个生产批次，并通过两个堆移除批次。 每个批次最多完全移除一次，而每个月只能部分处理当前移除停止的批次。 |
 | 空间| (O(k)) | 两个堆和批次数量数组每月最多包含一个逻辑批次，而每月输入数组也使用 (O(k)) 内存。 |

 在所有测试用例中，总数 (k) 最多为 (300,000)，因此 (O(k\log k)) 是实用的。 该算法从不依赖于潜在的巨大计算机总数，这就是它符合预期限制的原因。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import heapq

def solve_stream(stream):
    input = stream.readline
    t = int(input())
    out = []

    for _ in range(t):
        k = int(input())

        c = [0] * k
        d = [0] * k
        m = [0] * k
        p = [0] * k

        for i in range(k):
            c[i], d[i], m[i], p[i] = map(int, input().split())

        e = [0] * (k - 1)
        R = [0] * (k - 1)
        E = [0] * (k - 1)

        for i in range(k - 1):
            e[i], R[i], E[i] = map(int, input().split())

        min_heap = []
        max_heap = []
        remaining = []

        raw_cost = 0
        offset = 0
        total = 0
        ans = 0
        possible = True

        for i in range(k):
            if i > 0:
                offset += E[i - 1]
                raw_cost = min(c[i], raw_cost + R[i - 1])
            else:
                raw_cost = c[i]

            if p[i]:
                batch = len(remaining)
                remaining.append(p[i])
                key = raw_cost + m[i] - offset
                heapq.heappush(min_heap, (key, batch))
                heapq.heappush(max_heap, (-key, batch))
                total += p[i]

            if total < d[i]:
                possible = False
                break

            need = d[i]
            while need:
                while remaining[min_heap[0][1]] == 0:
                    heapq.heappop(min_heap)

                key, batch = heapq.heappop(min_heap)
                take = min(need, remaining[batch])

                ans += take * (key + offset)
                remaining[batch] -= take
                total -= take
                need -= take

                if remaining[batch]:
                    heapq.heappush(min_heap, (key, batch))

            if i < k - 1 and total > e[i]:
                remove = total - e[i]

                while remove:
                    while remaining[max_heap[0][1]] == 0:
                        heapq.heappop(max_heap)

                    neg_key, batch = heapq.heappop(max_heap)
                    take = min(remove, remaining[batch])

                    remaining[batch] -= take
                    total -= take
                    remove -= take

                    if remaining[batch]:
                        heapq.heappush(max_heap, (neg_key, batch))

        out.append(str(ans) if possible else "-1")

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve_stream(sys.stdin)
    finally:
        sys.stdin = old_stdin

# Provided samples
sample = """\
2
2
10 5 3 6
15 7 2 8
2 3 2
2
0 8 0 7
0 0 0 0
0 0 0
"""

assert run(sample) == "170\n-1", "provided samples"

# Minimum-size case.
# Every demand is satisfied immediately, with no inventory crossing.
minimum_case = """\
1
2
0 1 0 1
0 1 0 1
0 0 0
"""

assert run(minimum_case) == "0", "minimum-size case"

# All values equal.
# Each month produces exactly its demand, so storage is never needed.
all_equal_case = """\
1
2
5 2 3 2
5 2 3 2
2 1 1
"""

assert run(all_equal_case) == "32", "all equal values"

# Raw material is bought in month 1, stored, then used in month 2.
# The finished computer also crosses the boundary and pays E.
storage_case = """\
1
2
1 0 0 1
100 1 0 1
1 1 2
"""

assert run(storage_case) == "3", "raw and finished-good storage"

# Maximum-size case.
# 50,000 months, one computer demanded and produced every month,
# with zero costs and zero finished-goods storage.
k = 50000
maximum_case = (
    "1\n"
    + str(k)
    + "\n"
    + ("0 1 0 1\n" * k)
    + ("0 0 0\n" * (k - 1))
)

assert run(maximum_case) == "0", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸的箱子需要两个月的时间并立即生产|`0`| 基本界限，无不必要库存|
 | 两个月的价格和产能相同 |`32`| 等成本批次和数量聚合|
 | 早期原材料采购加成品储存|`3`| 原始存储重复和成品存储成本|
 | 生成的 (k=50,000) 案例 |`0`| 最大输入大小并独立于计算机总数 |

 ## 边缘情况

 零仓库容量意味着任何成品计算机都不能跨越该边界。 考虑```
1
2
0 0 0 2
0 2 0 0
1 0 0
```在第 1 个月，有两名候选人可用，需求为零。 处理需求后，库存包含两台计算机，但是 (e_1=1)，因此最大成本堆删除一台。 剩余库存为一号尺寸。 第 2 个月的需求为 2，生产能力为零，因此只有一台计算机可用，算法返回 (-1)。 容量在当前销售之后应用，恰好是边界约束所属的位置。 

原材料可以在生产月份之前很久就购买。 考虑```
1
2
1 0 0 0
100 1 0 1
1 1 0
```第一个月的有效原材料成本为 (1)。 第二个月的有效原始成本为 (\min(100,1+1)=2)。 因此，第二个月以成本 (2) 生产所需的计算机，得出答案 (2)。 该算法不需要显式的原材料库存，因为`raw_cost`已经代表了将一单位原材料转移到当月的最便宜的方式。 

成品储存也有类似的累积效应。 考虑```
1
2
1 0 0 1
100 1 0 1
1 1 2
```第一个月的计算机有生产成本 (1)。 它能够通过容量检查，因为 (e_1=1)。 当算法前进到第 2 个月时，`offset`增加(2)，因此存储的计算机当前成本变为(1+2=3)。 第 2 个月的新计算机的成本为 (100)，因此最小堆出售存储的计算机，答案变为 (3)。 

零需求也需要在不触及最小堆的情况下进行处理。 例如，```
1
2
0 0 0 1
0 1 0 1
0 0 0
```有答案（0）。 第一个月可能有一个生产候选，但其需求为零，存储容量也为零，因此该候选在边界处被丢弃。 然后，第 2 个月以零成本生产自己所需的计算机。 假设每个候选产品最终都必须被出售的单元级实现可能会错误地对废弃的计算机进行收费。 

最后，一批只能部分出售或部分丢弃。 考虑第一个样本的第一个月，有六名候选人可用，但只有五名售出。 批次数量从 6 个变为 1 个，剩余的 1 个保留在两个堆结构中。 稍后，如果该批次成为最昂贵的幸存批次，则最大堆可以仅删除该一台计算机。 存储每个批次的数量可以使该操作独立于批次中的计算机数量。
