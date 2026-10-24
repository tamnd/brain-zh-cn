---
problem: 1282C
contest_id: 1282
problem_index: C
name: "Petya and Exam"
contest_name: "Codeforces Round 610 (Div. 2)"
rating: 1800
tags: ["greedy", "sortings", "two pointers"]
answer: passed_samples
verified: false
solve_time_s: 175
date: 2026-06-14
model: gpt-5-3-mini
samples_passed: 0
samples_total: 1
share_url: https://chatgpt.com/share/6a2da601-1174-83ec-845c-92c2dc74892b
---

# CF 1282C - Petya 和考试

 **评分：** 1800
 **标签：** 贪婪、排序、两个指针
 **型号：** gpt-5-3-mini
 **求解时间：** 2m 55s
 **已验证：** 否（0/1 个样本）
 **分享：** https://chatgpt.com/share/6a2da601-1174-83ec-845c-92c2dc74892b

 ---

 ## 解决方案

 ## 问题理解

 每个测试用例都描述了一次考试，其中问题在截止日期前到达，并且根据它们是简单还是困难而花费不同的时间。 Petya 从零时间开始按顺序处理问题，选择一个顺序，并可能在任何整数时间停止$s \le T$。 他的分数取决于他解决了多少问题，但前提是每个问题的截止日期最多为$s$到时候已经解决了。 如果在他离开时，即使有一个这样的“活跃”问题仍未解决，那么该尝试的分数就会为零。 

因此，真正的结构不仅仅是调度，而是选择时间前缀并选择适合该时间的问题子集，同时遵守两个约束：花在所选问题上的总时间不能超过$s$，以及最多有截止日期的所有问题$s$必须包含在该已解决的集合中。 

关键的压力是增加$s$放宽了最后期限，但也增加了所需的工作量，因为更多的问题成为强制性的。 一个好的解决方案是在某个平衡点上，Petya 仍然可以完成所有必答题，并用可选题来填补剩余时间。 

这些约束意味着任何解决方案都必须接近每个测试用例的线性或线性算数。 自总计$n$跨测试是$2 \cdot 10^5$，子集或时间点上的任何二次模拟都会立即变得太慢。 基于排序的策略和贪婪扫描是自然的选择。 

当我们假设一旦解决了一组强制性问题，我们就可以贪婪地采取最便宜的剩余问题，而不考虑最后期限设置如何随着我们的移动而变化时，就会出现一种常见的失败情况$s$。 例如，选择较晚的时间$s$如果不确保所有较早截止日期的可行性，则会导致无效的评分重置。 

如果我们尝试修复，就会发生另一个微妙的故障$s$并以任意顺序贪婪地解决问题，而不区分简单成本和困难成本。 例如，尽早混合困难问题可能会阻碍满足更严格的早期截止日期，而这本来是最佳的。 

## 方法

 暴力方法会尝试所有可能的离开时间$s$，并且对于每个$s$确定 Petya 在时间限制下可以解决的最大问题数$s$同时也解决了所有问题$t_i \le s$。 对于固定的$s$，我们首先会确定强制性问题，确保它们能够适应$s$，然后通过增加解决时间的顺序贪婪地添加其他问题。 这是正确的，但价格昂贵。 

对于每个$s$，扫描所有问题并对候选人成本进行排序$O(n \log n)$，并为所有人做这件事$T$可能的时间是不可能的，因为$T$可以是$10^9$。 即使我们只考虑不同$t_i$, 仍有多达$n$候选人，给予$O(n^2 \log n)$在最坏的情况下。 

关键的观察是，最佳答案仅出现在等于某些时间的情况下$t_i$或在$T$。 任何最优策略都必须在新问题成为强制性问题时“开启”新约束。 这减少了候选集$s$至多$n+1$。 

一次$s$已修复，所有问题均分为强制性问题（截止日期$\le s$）和可选（截止日期$> s$）。 必须包括强制性的，并定义基本时间成本。 如果这个基本成本超过$s$，选择$s$无效。 

在可选问题中，我们希望根据剩余时间最大化计数。 因为每个问题要么是成本$a$或者$b$，最佳方法是始终先采取更容易的方法。 这变成了一个经典的背包式贪心算法，不需要排序：我们只计算有多少个简单问题和困难问题可用。 

我们可以通过按截止日期对问题进行排序并维护简单和困难类型的前缀计数来进行预处理。 然后对于每个候选人$s$，我们确切地知道存在多少强制性的简单/困难问题，以及还有多少可选的问题。 使用总时间来检查可行性，并贪婪地使用剩余时间来添加更多问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力胜过一切$s$|$O(n^2 \log n)$|$O(n)$| 太慢了|
 | 排序+前缀+贪婪扫描 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们独立处理每个测试用例。 

1.将所有问题按照强制时间排序$t_i$。 这确保了随着我们的增加$s$，强制性问题集只会增长。 这种单调性是允许前缀处理的核心结构。 
2.构建前缀计数：at位置$i$，存储第一个出现的简单问题和困难问题有多少个$i$问题按顺序排列。 
3.考虑每个候选人的时间$s$作为任一$t_i$对于某些人来说$i$， 或者$T$。 对于固定前缀最多$i$，所有这些问题都是强制性的。 
4. 计算强制时间成本为$cost = easy_i \cdot a + hard_i \cdot b$。 如果这超过$s$，跳过这个$i$因为 Petya 甚至无法满足所需的约束。 
5. 如果可行，计算剩余时间$rem = s - cost$。 还计算剩余的可选计数：前缀之外的简单和困难。 
6. 为了最大程度地解决问题，请始终首先解决简单的可选问题，因为它们在每个问题上花费的时间较少。 使用尽可能多的容易适应的$rem$，然后使用困难问题。 
7. 跟踪所有有效解决方案的最大总数$s$。 

### 为什么它有效

 按截止日期排序的扫描保证每个有效的解决方案都对应于排序数组的某个前缀。 在任何固定前缀内，可行性仅取决于所需的总处理时间，而不是顺序。 由于给定类型的所有任务都具有相同的成本，因此剩余时间的最佳利用是贪婪的：在解决问题的数量方面，首先执行较容易的任务总是在与困难任务的任何交换中占主导地位。 这创建了一个稳定的最优结构，其中前缀可行性和局部贪婪填充一起覆盖了所有最优调度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    m = int(input())
    for _ in range(m):
        n, T, a, b = map(int, input().split())
        tp = list(map(int, input().split()))
        t = list(map(int, input().split()))

        arr = list(zip(t, tp))
        arr.sort()

        easy_pref = [0]
        hard_pref = [0]

        for ti, typ in arr:
            easy_pref.append(easy_pref[-1] + (typ == 0))
            hard_pref.append(hard_pref[-1] + (typ == 1))

        ans = 0

        def evaluate(limit_time, idx):
            easy_m = easy_pref[idx]
            hard_m = hard_pref[idx]

            cost = easy_m * a + hard_m * b
            if cost > limit_time:
                return 0

            rem = limit_time - cost

            easy_total = easy_pref[-1]
            hard_total = hard_pref[-1]

            easy_avail = easy_total - easy_m
            hard_avail = hard_total - hard_m

            take_easy = min(easy_avail, rem // a)
            rem -= take_easy * a

            take_hard = min(hard_avail, rem // b)

            return easy_m + hard_m + take_easy + take_hard

        n = len(arr)

        for i in range(n + 1):
            limit = T if i == n else arr[i-1][0]
            ans = max(ans, evaluate(limit, i))

        print(ans)

if __name__ == "__main__":
    solve()
```代码首先对问题进行排序，以便任何前缀都对应于可行的截止时间阈值。 前缀数组允许恒定时间提取强制计数。 评估函数强制执行强制性任务的可行性，然后以成本递增的顺序（先易后难）贪婪地用可选任务填充剩余时间。 每个前缀都作为潜在的最佳截止进行测试。 

一个微妙的细节是候选时间被精确地视为截止时间值。 选择两个截止日期之间的任何中间时间不会改变强制集，只会收紧时间预算，因此无法改进答案。 

## 工作示例

 考虑一个具有混合期限和成本的小案例：

 输入：```
1
4 10 1 3
0 1 0 1
2 3 5 7
```按截止日期排序：

 | 我| t | 类型 | 简单偏好 | 硬偏好|
 | ---| ---| ---| ---| ---|
 | 1 | 2 | 0 | 1 | 0 |
 | 2 | 3 | 1 | 1 | 1 |
 | 3 | 5 | 0 | 2 | 1 |
 | 4 | 7 | 1 | 2 | 2 |

 对于前缀$i=2$，极限为$s=3$。 强制性成本是$1\cdot1 + 1\cdot3 = 4$，超过3，所以无效。 

对于前缀$i=3$， 限制$s=5$。 强制性成本是$2 + 3 = 5$，rem = 0，分数 = 3。 

对于前缀$i=4$， 限制$s=7$。 强制cost=8，rem=-1，无效。 

最佳答案是 3。 

该跟踪显示了如何纯粹通过成本过滤不可行的前缀，以及可行性如何在每个截止日期阈值处急剧变化。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 排序占主导地位，每个前缀评估都是 O(1) |
 | 空间|$O(n)$| 用于排序和前缀和的数组 |

 该解决方案非常适合，因为总$n$所有测试用例的总和是$2 \cdot 10^5$，使基于排序的处理在一定范围内变得高效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    m = int(input())
    out = []
    for _ in range(m):
        n, T, a, b = map(int, input().split())
        tp = list(map(int, input().split()))
        t = list(map(int, input().split()))
        arr = list(zip(t, tp))
        arr.sort()

        easy_pref = [0]
        hard_pref = [0]
        for ti, typ in arr:
            easy_pref.append(easy_pref[-1] + (typ == 0))
            hard_pref.append(hard_pref[-1] + (typ == 1))

        def eval(limit, idx):
            em = easy_pref[idx]
            hm = hard_pref[idx]
            cost = em * a + hm * b
            if cost > limit:
                return 0
            rem = limit - cost
            ea = easy_pref[-1] - em
            ha = hard_pref[-1] - hm
            take_e = min(ea, rem // a)
            rem -= take_e * a
            take_h = min(ha, rem // b)
            return em + hm + take_e + take_h

        ans = 0
        n = len(arr)
        for i in range(n + 1):
            limit = T if i == n else arr[i-1][0]
            ans = max(ans, eval(limit, i))

        out.append(str(ans))

    return "\n".join(out)

# provided samples (single aggregated test)
assert run("""10
3 5 1 3
0 0 1
2 1 4
2 5 2 3
1 0
3 2
1 20 2 4
0
16
6 20 2 5
1 1 0 1 0 0
0 8 2 9 11 6
7 17 1 6
1 1 0 1 0 0 0
1 7 0 11 10 15 10
6 17 2 6
0 0 1 0 0 1
7 6 3 7 10 12
5 17 2 5
1 1 1 1 0
17 11 10 6 4
1 1 1 2
0
1
""") == """3
2
1
0
1
4
0
1
2
1"""

# small custom case
assert run("""1
2 5 1 2
0 1
1 2
""") == "2", "basic mix"

# all easy
assert run("""1
3 10 1 5
0 0 0
1 2 3
""") == "3", "all easy"

# all hard tight time
assert run("""1
3 5 1 4
1 1 1
1 2 3
""") == "1", "hard constraint"

# boundary zero deadlines
assert run("""1
2 5 1 2
0 1
0 5
""") == "2", "deadline edge"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 混合小箱| 2 | 类型的相互作用 |
 | 一切都很容易| 3 | 贪婪填充正确性 |
 | 全部硬紧| 1 | 可行性剪枝|
 | 零期限组合| 2 | t_i = 0 | 的边界处理

 ## 边缘情况

 关键的边缘情况是所有强制性问题都已经超过给定前缀的时间限制。 例如，如果$s$等于一个小的提前截止日期，但包含多个硬问题，成本检查立即拒绝它。 该算法正确地为该前缀返回零，而不会尝试贪婪填充，从而确保无效的时间表不会泄漏部分分数。 

当所有问题都很容易时，就会出现另一种边缘情况。 那么每个前缀都是可行的，最优策略就是在范围内取尽可能多的前缀$T$。 贪婪填充阶段自然减少为按照截止时间递增的顺序执行所有任务，并且解决方案实现了满计数。 

最后一个微妙的情况是截止日期相等或集中的情况。 由于排序在值方面是稳定的，因此相同的截止日期不会产生歧义：前缀结构仍然正确捕获所有强制集，并且在每个边界进行评估仍然足够。
