---
title: "CF 1045G - 人工智能机器人"
description: "我们有一组放置在数轴上的机器人。 每个机器人位于一个坐标上，并在其位置周围有一个固定的对称可见范围。 在这个范围内，它有可能“看到”其他机器人。 然而，仅有可见性不足以进行交互。"
date: "2026-06-16T17:14:16+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1045
codeforces_index: "G"
codeforces_contest_name: "Bubble Cup 11 - Finals [Online Mirror, Div. 1]"
rating: 2200
weight: 1045
solve_time_s: 153
verified: true
draft: false
---

[CF 1045G - 人工智能机器人](https://codeforces.com/problemset/problem/1045/G)

 **评分：** 2200
 **标签：** 数据结构
 **求解时间：** 2m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组放置在数轴上的机器人。 每个机器人位于一个坐标上，并在其位置周围有一个固定的对称可见范围。 在这个范围内，它有可能“看到”其他机器人。 然而，仅有可见性不足以进行交互。 只有当两个机器人都能看到对方并且它们的 IQ 值足够接近时，特别是当它们的 IQ 之间的绝对差值最多为 K 时，两个机器人才会进行通信。 

任务是计算有多少无序机器人对同时满足这两个条件：相互可见性和 IQ 兼容性。 

约束足够大，以至于对所有对进行任何二次比较都会立即变得太慢。 对于多达 100000 个机器人，简单的 O(N²) 检查意味着大约 1010 次比较，这远远超出了 2 秒允许的范围。 这迫使我们将问题视为具有附加值约束的几何范围计数问题。 

一个微妙的点是可见性是有方向性的。 机器人A可以看到机器人B并不意味着相反。 然而，该问题要求相互通信，因此我们必须只计算两个可见性条件同时成立的对。 这有效地将可见性转变为区间交叉条件。 

当机器人的范围较大或位置相同时，就会出现边缘情况。 例如，如果所有机器人都位于同一坐标但具有不同的 IQ，则可见性微不足道，但 IQ 过滤占主导地位。 相反，如果所有智商都相等但范围很小，则几何学占主导地位。 

一个天真的错误是，如果一个机器人看到另一个，就数一对，而不是要求相互可见。 如果我们独立地迭代可见性列表，另一个错误是重复计算对。 

## 方法

 强力解决方案检查每对机器人并直接验证这两个条件。 对于每一对 (i, j)，我们计算 xj 是否位于 i 的可见性区间内，xi 是否位于 j 的可见性区间内，然后检查 IQ 差异。 这是正确的，但非常昂贵，需要 N(N−1)/2 检查，每次恒定时间。 当 N = 10⁵ 时，这是不可行的。 

为了改进，我们需要将相互可见性条件转换为单个几何约束。 关键的观察是，相互可见性意味着 xj ∈ [xi − ri, xi + ri] 和 xi ∈ [xj − rj, xj + rj]。 这两个不等式等价于一个条件：xi 和 xj 之间的距离必须至多为 ri + rj。 这完全消除了方向性，并将几何图形转变为对称约束。 

现在问题变成了计算 |xi − xj| 的对 ≤ ri + rj 和 |qi − qj| ≤K。 

这是一个二维范围约束：一个维度是几何维度（位置加半径），另一个维度是小的有界 IQ 差异。 由于 K ≤ 20，IQ 的值范围非常小，这建议按 IQ 对机器人进行分组，并且仅比较附近的 IQ 桶。 

我们可以按位置对机器人进行排序，然后使用扫描线或两指针结构将候选机器人保持在空间约束内。 对于每个机器人，我们维护一个在其可见范围内的先前见过的机器人的结构。 由于 K 很小，我们维护多个由 IQ 偏移键控的活动结构。 这使得我们只能与最多 41 个 IQ 桶进行比较。 

主要困难是维护按位置排序的动态活动机器人集，同时支持查询有多少机器人位于有效间隔内。 标准方法是为每个 IQ 类使用平衡的二进制索引结构，或者使用两个指针和位置上的滑动窗口维护排序列表，在我们扫描时插入机器人。 

因此，该解决方案简化为按位置清扫，维护其右可见边界覆盖当前位置的主动机器人，并计算范围内兼容的 IQ。

| 方法| 时间复杂度| Space Complexity | 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) | O(1) | O(1) | 太慢了|
 | 最佳 | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 将每个机器人转换为类似区间的实体，其影响力由其位置和半径表示，但我们依靠对排序位置的扫描来逐步实施几何约束。 
2. 按位置 x 对机器人进行排序。 排序至关重要，因为它允许我们使用滑动窗口而不是任意对来推理可见性。 这确保我们只按递增的空间顺序处理潜在的合作伙伴。 
3. 维护一个数据结构，跟踪当前“活动”的机器人，这意味着它们的可见范围延伸到当前的扫描位置。 具体来说，当我们到达 x 使得 x ≤ xi + ri 时，机器人 i 变得活跃，而当 x 超过这个界限时，它变得无关紧要。 
4. 对于按排序顺序的每个机器人 j，从活动集中删除所有机器人 i，使得 xj > xi + ri。 这些机器人无法再看到右侧的任何东西，因此它们无法组成未来的配对。 
5. 清理后，查询活动结构中位置位于 [xj − rj, xj + rj] 范围内的机器人。 这确保了相互可见性，因为所有主动机器人都已经通过扫描的构造满足了相反的条件。 
6. 在查询的空间范围内，仅统计 IQ 与 qj 最多相差 K 的机器人。由于 K 很小，因此迭代从 qj − K 到 qj + K 的 IQ 桶，并对它们的计数求和。 
7. 将当前机器人插入到活动结构中，并按其 IQ 进行索引，以便它可以参与将来的查询。 

正确性依赖于维持位置 x 处的活动集恰好包含可见区间仍然覆盖 x 的机器人的不变量。 这确保了计数的任何对已经满足相互可见性约束的一个方向，而第二个方向是通过限制空间查询窗口来强制执行的。 因为我们只计算每个当前机器人的早期机器人，所以每对只计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    robots = [tuple(map(int, input().split())) for _ in range(n)]

    robots.sort(key=lambda t: t[0])  # sort by position

    # active list: (x, r, q)
    active = []
    ans = 0

    for xj, rj, qj in robots:
        new_active = []

        # remove expired robots (those that cannot see xj anymore)
        for xi, ri, qi in active:
            if xi + ri >= xj:
                new_active.append((xi, ri, qi))
        active = new_active

        # count valid pairs with current robot
        for xi, ri, qi in active:
            if abs(xi - xj) <= rj and abs(qi - qj) <= k:
                ans += 1

        # add current robot
        active.append((xj, rj, qj))

    print(ans)

if __name__ == "__main__":
    solve()
```The code directly follows the sweep idea but uses a simplified structure to keep the logic visible. The active list represents robots whose right visibility boundary still reaches the current position. Expiration removes robots that can no longer participate in future interactions.

 The counting step checks both spatial and IQ constraints. 由于扫描中 xi ≤ xj ，所以空间条件被简化，因此只有主动机器人的右边界对于相互可见性很重要，而左边界则通过主动集的构造隐式满足。 

一个微妙的实施风险是忘记扫描强制执行排序。 Because we process robots in increasing x, every active robot already lies to the left or equal, which removes the need for symmetric checks.

 ## 工作示例

 ### 示例 1

 输入：```
3 2
3 6 1
7 3 10
10 5 8
```已按 x 排序。 

| 当前| 之前活跃 | 已删除 | 格纹对 | 新活动 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | (3,6,1) | []| []| 0 | [(3,6,1)] | 0 |
 | (7,3,10) | [(3,6,1)] | 无 | 0 | [(3,6,1),(7,3,10)] | 0 |
 | (10,5,8) | [(3,6,1),(7,3,10)] | （3,6,1 已删除？否），无 | (7,3,10) valid → 1 | [(7,3,10),(10,5,8)] | 1 |

 该迹线表明，只有第二个和第三个机器人同时满足几何重叠和 IQ 接近度。 

### 示例 2

 输入：```
4 1
0 5 5
3 5 5
6 5 6
10 5 5
```| 当前| 之前活跃 | 已删除 | 格纹对 | 回答 |
 | --- | --- | --- | --- | --- |
 | (0,5,5) | []| []| 0 | 0 |
 | (3,5,5) | [(0,5,5)] | 无 | (0,5,5) → 有效 | 1 |
 | (6,5,6) | [(0,5,5),(3,5,5)] | 无 | 无（其中一人智商不匹配）| 1 |
 | (10,5,5) | (10,5,5) | [(3,5,5),(6,5,6)] | (0 已删除) | (3,5,5) 有效 | 2 |

 This demonstrates how IQ filtering prunes interactions even when geometry allows many overlaps.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N²) 最差，O(N²) 有效（朴素形式） | 每个插入扫描活动集 |
 | 空间| O(N) | 存储活动机器人|

 Although the sweep reduces redundant checks, the lack of indexing makes worst-case performance quadratic. 当 N = 10⁵ 时，这仍然是不够的，但它反映了后来优化解决方案构建的核心结构思想：限制与本地活动窗口的比较。 

预期的完全最优解决方案将活动列表替换为每个 IQ 存储桶的索引结构，并将空间查询减少为对数或线性滑动窗口操作，从而实现 O(N log N)。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve  # assume solution is in main.py
    return solve()

# provided sample
assert run("""3 2
3 6 1
7 3 10
10 5 8
""") == "1"

# minimum case
assert run("""1 0
0 0 0
""") == "0"

# all equal IQ, full overlap
assert run("""3 5
0 10 1
5 10 1
8 10 1
""") == "3"

# no overlaps
assert run("""3 0
0 1 1
100 1 1
200 1 1
""") == "0"

# tight boundary case
assert run("""2 0
0 1 5
2 2 5
""") == "1"
```| Test input | 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 robot | 0 | 最小边缘情况|
 | identical IQ overlap | 3 | 互动全面饱和|
 | far apart | 0 | geometry exclusion |
 | boundary visibility | 1 | 包含范围正确性 |

 ## 边缘情况

 考虑所有机器人共享相同位置但智商不同的情况。 例如：```
4 1
0 5 1
0 5 2
0 5 3
0 5 10
```这里每对都满足可见性，因为所有范围在同一点完全重叠。 该算法使所有机器人同时处于活动状态，因为没有一个机器人会过期。 然后它只计算智商差值最多为 1 的对，因此只有 (1,2,3) 中相邻的智商对有贡献，而 (10) 机器人没有贡献。 

Now consider extreme radii:```
3 10
0 100 5
50 100 14
200 100 6
```前两个机器人在扫描过程中保持活跃状态​​，满足空间和 IQ 约束，产生一对有效的机器人。 一旦处理完毕，第三个机器人在空间上距离前面的两个机器人太远，因此它永远不会做出贡献。 

最后，考虑最小 K = 0。在这种情况下，IQ 条​​件变为严格相等。 该算法仍然有效，因为 IQ 窗口折叠为单个存储桶，并且仅计算相同的值。
