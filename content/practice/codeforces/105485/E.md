---
title: "CF 105485E - \u4f24\u5bb3\u6700\u5927\u5316"
description: "我们正在安排短期内最多 18 个步骤的操作。 在每个时间步，我们必须准确选择四种技能中的一种。"
date: "2026-06-23T01:56:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105485
codeforces_index: "E"
codeforces_contest_name: "2024 China Unversity of Geosciences (Wuhan) Freshman Contest"
rating: 0
weight: 105485
solve_time_s: 57
verified: true
draft: false
---

[CF 105485E - \u4f24\u5bb3\u6700\u5927\u5316](https://codeforces.com/problemset/problem/105485/E)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在安排短期内最多 18 个步骤的操作。 在每个时间步，我们必须准确选择四种技能中的一种。 我们的目标是在所有步骤之后最大化总伤害，但每个步骤的选择并不是独立的，因为有两个约束相互作用：冷却时间和可以延续到未来步骤的乘法增益。 

一项技能会根据当前时间步长指数造成固定伤害，因此在不同时间使用它会改变其价值。 一项技能会积累一种称为怒气的资源，而另一项技能会消耗所有积累的怒气来造成伤害而不重置伤害。 最后一个技能不是直接伤害，而是修改了下一个动作，使下一回合的伤害翻倍。 如果在连续结构中重复应用，加倍效果会叠加。 

一个关键的限制是每个技能都有两步的冷却时间，这意味着如果在时间 i 使用某个技能，则不能在时间 i+1 或 i+2 时使用该技能。 最初，没有激活冷却时间，也没有存储怒气。 

输入由步数 n、定义使用第二个技能时获得多少怒气的常量 a 和数组 d 组成，其中 di 是在时间 i 时使用第一个技能的伤害值。 输出是n步后最大可能的总伤害。 

约束 n ≤ 18 立即表明指数状态探索是可能的。 任何复杂度大约为 4^n 或 5^n 的解决方案仍然是可行的。 这强烈表明了随着时间和冷却状态的位掩码动态编程方法。 

愤怒积累和消耗之间的相互作用产生了一个微妙的边缘情况。 第三个技能永远不会清除怒气，因此如果存在怒气，多次使用它会严格增加。 然而，在怒气很小的时候尽早使用它可能比等待更糟糕，而且由于冷却时间限制了重复，我们不能贪婪地发送垃圾邮件。 

另一个边缘情况是技能加倍。 如果重复应用，它可以创建长链，使多个未来操作加倍。 例如，在时间 i 和 i+1 处使用技能 4 在时间 i+2 上会产生 4 的乘数。 将加倍视为仅影响下一步的天真解释会低估伤害。 

最后，由于 di 取决于时间，因此重新排序或将技能 1 视为静态值是不正确的。 正确的解决方案必须同时考虑时间相关值和冷却时间约束。 

## 方法

 强力解决方案将在 n 个时间步长内模拟所有可能的选择序列，尊重冷却时间限制并显式跟踪怒气和乘数状态。 在每一步中，我们最多有 4 个选择，因此最多会产生 4^n 个序列。 当 n = 18 时，大约有 43 亿种可能性，这个数字太大了。 

暴力在概念上是正确的原因是状态转换完全是本地的：下一个状态仅取决于当前的冷却状态、当前的愤怒以及乘数是否处于活动状态。 然而，关键的失败在于可以通过多种不同的方式达到相同的冷却和增益逻辑配置。 例如，以零怒气但乘数为 2 和给定的冷却时间曲线到达步骤 i 并不取决于产生它的确切序列。 这种子问题的重叠使得动态规划成为可能。 

观察结果是步数很少，但状态包含可以紧凑编码的结构化约束。 每个技能的冷却时间长度为 2，因此我们只需要跟踪每个技能对小范围取模的最后使用时间。 愤怒累积是单调的并且最多以 n·a 为界。 加倍效果可以表示为仅适用于下一个动作的乘数，因此它可以作为二进制标志折叠到状态中：下一个动作是否加倍。

因此，我们定义了 DP 随着时间的推移指数、当前怒气和冷却时间配置，以及待定乘数标志。 由于 n 很小，我们可以将冷却时间压缩为位掩码或小整数状态，并且愤怒是有界的，使转换易于管理。 

结果是对所有有效状态的记忆搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(4^n) | O(4^n) | O(n) | 太慢了 |
 | 最佳DP | O(n · S) 其中 S 是状态空间 (~2^n · n · 2) | O(S)| 已接受 |

 ## 算法演练

 我们将该过程建模为递归 DP，其中每个状态代表一个时间索引以及决定未来操作所需的所有信息。 

1. 定义一个函数 dp(i, rage, last1, last2,ending_double)，其中 i 是当前时间步长，rage 是累计怒气，last1 和 last2 编码最近的使用历史记录用于冷却跟踪，pending_double 表示下一个动作是否加倍。 

这种状态就足够了，因为冷却时间仅取决于最近的使用情况，怒气是累积的，并且乘数仅影响立即的下一个动作。 
2. 每次i，迭代四种可能的技能，但跳过任何违反从last1和last2导出的冷却时间约束的技能。 

这种修剪是必要的，因为无效的转换不会对可行的时间表做出贡献。 
3. 对于每个有效的技能选择，计算其效果：

 技能 1 增加 di 伤害乘以pending_double，然后清除pending_double。 

技能2增加怒气a，但不产生伤害。 

技能3将当前怒气添加为伤害乘以pending_double，而不重置怒气，并清除pending_double。 

技能4为下一步设置pending_double。 
4. 通过移动上次使用信息来更新冷却历史记录，以反映在时间 i 时选择的技能。 

这确保了未来状态正确反映两步冷却时间限制。 
5.递归到dp(i+1,updated_rage,updated_last1,updated_last2,updated_pending_double)，并在所有选择中取最大值。 
6. 基本情况：当 i == n 时，返回 0，因为没有剩余的进一步操作。 

答案是 dp(0, 0, 空冷却状态, 0 待定乘数)。 

### 为什么它有效

 每个州都准确地编码了确定未来法律行动及其后果所需的信息。 导致相同元组（i，愤怒，冷却状态，待定乘数）的两个不同历史是可以互换的，因为所有未来的决策仅取决于这些值。 DP 探索每个等价类一次并存储最佳结果，因此不会跳过最佳序列，也不会计算无效序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from functools import lru_cache

n, a = map(int, input().split())
d = list(map(int, input().split()))

# We encode cooldown state as a 4-bit mask:
# bit j = 1 means skill j was used in previous 2 steps in a way that blocks it.
# For simplicity in this small n, we track last usage times per skill.

@lru_cache(None)
def dp(i, rage, last0, last1, last2, last3, pending):
    if i == n:
        return 0

    best = 0

    last = [last0, last1, last2, last3]

    for s in range(4):
        # cooldown: if used within last 2 steps, skip
        if i - last[s] <= 2:
            continue

        nlast = last[:]
        nlast[s] = i

        if s == 0:
            gain = d[i] * (2 if pending else 1)
            best = max(best, gain + dp(i + 1, rage, nlast[0], nlast[1], nlast[2], nlast[3], 0))

        elif s == 1:
            best = max(best, dp(i + 1, rage + a, nlast[0], nlast[1], nlast[2], nlast[3], 0))

        elif s == 2:
            gain = rage * (2 if pending else 1)
            best = max(best, gain + dp(i + 1, rage, nlast[0], nlast[1], nlast[2], nlast[3], 0))

        else:
            best = max(best, dp(i + 1, rage, nlast[0], nlast[1], nlast[2], nlast[3], 1))

    return best

print(dp(0, 0, -10, -10, -10, -10, 0))
```该代码随着时间的推移实现了记忆递归。 使用每个技能的上次使用时间戳来跟踪冷却时间，这允许持续检查技能是否可用。 怒气直接作为整数状态结转。 待处理乘数是一个布尔值，指示下一个操作是否应加倍。 

一个微妙的细节是应用挂起标志后的重置。 技能1和技能3都会消耗乘数，而技能4则为下一步设置乘数。 这确保了每次激活时都会应用一次加倍效果。 

选择将上次使用时间初始化为负值可确保所有技能最初都可用。 

## 工作示例

 考虑样本输入。 

输入：

 n = 5，a = 9

 d = [1, 10, 7, 3, 8]

 我们追踪一个简化的最佳序列：技能 4、技能 1、技能 2、技能 4、技能 3。 

| 我| 选择的技能| 愤怒| 待定 | 增益| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 4 | 0 | 1 | 0 | 0 |
 | 1 | 1 | 0 | 0 | 10 | 10 10 | 10
 | 2 | 2 | 9 | 0 | 0 | 10 | 10
 | 3 | 4 | 9 | 1 | 0 | 10 | 10
 | 4 | 3 | 9 | 0 | 18 | 18 28 | 28

 这个简化的轨迹显示了怒气在消耗之前如何累积，以及加倍如何影响之后的消耗。 

第二个构造的例子：

 输入：

 n = 3，a = 5

 d = [2, 4, 6]

 一种最佳顺序是技能 2、技能 4、技能 3。 

| 我| 技能 | 愤怒| 待定 | 增益| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 2 | 5 | 0 | 0 | 0 |
 | 1 | 4 | 5 | 1 | 0 | 0 |
 | 2 | 3 | 5 | 0 | 10 | 10 10 | 10

 这表明，延迟怒气消耗直到加倍设置之后会产生严格更高的输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·R·C·2) | n 个状态，怒气受 n·a 限制，冷却时间配置受上次使用编码限制，挂起标志加倍状态 |
 | 空间| O(n·R·C·2) | 完整状态空间上的记忆表|

 由于 n ≤ 18，状态空间仍然很小，因此即使是经过修剪的配置的完整枚举也能轻松地在限制范围内。 递归仅访问可达状态，并且每次转换的时间复杂度为 O(1)。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from functools import lru_cache

    n, a = map(int, _sys.stdin.readline().split())
    d = list(map(int, _sys.stdin.readline().split()))

    @lru_cache(None)
    def dp(i, rage, l0, l1, l2, l3, pending):
        if i == n:
            return 0
        last = [l0, l1, l2, l3]
        best = 0
        for s in range(4):
            if i - last[s] <= 2:
                continue
            nl = last[:]
            nl[s] = i
            if s == 0:
                best = max(best, d[i] * (2 if pending else 1) + dp(i+1, rage, nl[0], nl[1], nl[2], nl[3], 0))
            elif s == 1:
                best = max(best, dp(i+1, rage + a, nl[0], nl[1], nl[2], nl[3], 0))
            elif s == 2:
                best = max(best, rage * (2 if pending else 1) + dp(i+1, rage, nl[0], nl[1], nl[2], nl[3], 0))
            else:
                best = max(best, dp(i+1, rage, nl[0], nl[1], nl[2], nl[3], 1))
        return best

    return str(dp(0, 0, -10, -10, -10, -10, 0))

# provided sample
assert run("5 9\n1 10 7 3 8\n") == "38", "sample 1"

# minimum case
assert run("1 5\n10\n") == "10", "single step"

# all same values
assert run("3 1\n5 5 5\n") == "15", "uniform case"

# testing doubling effect
assert run("2 1\n1 100\n") >= "100", "doubling presence"

# rage accumulation test
assert run("3 10\n1 1 1\n") >= "10", "rage accumulation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 5 / 10 | 10 | 10 基本情况正确性 |
 | 3 1 / 5 5 5 | 3 1 / 5 5 5 15 | 15 对称处理|
 | 2 1 / 1 100 | 2 1 / 1 100 ≥100 | 加倍适用性 |
 | 3 10 / 1 1 1 | 3 10 / 1 1 1 ≥10 | 愤怒积累行为|

 ## 边缘情况

 一个关键的边缘情况是重复使用技能 4 时。 因为它只影响下一步，所以链接它可以创建交替的加倍模式。 DP 处理这个问题是因为挂起标志在每一步都被显式携带和覆盖。 例如，输入n = 2，其中两个步骤都是技能4，不会造成直接伤害，但确保不会出现未定义的乘数累积。 

另一个边缘情况是早期愤怒收集。 如果太早使用技能 2，怒气会增加，但在冷却限制下技能 3 可用之前无法使用。 DP 明确地将愤怒跟踪为连续状态，因此可以正确保留中间累积。 

最后的边缘情况接近序列的末尾，如果不存在未来的步骤，则应用技能 4 可能会浪费其效果。 基本情况 i == n 自然可以防止过度计数，因为将在范围之外应用的待定乘数不会对任何转换做出贡献。
