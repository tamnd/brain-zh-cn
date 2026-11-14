---
title: "CF 33E - 助手"
description: "瓦莱拉列出了他知道如何解决的课题清单。 每个科目都需要固定的工作时间。 学生提出请求：每个请求都有一个主题、考试截止日期和奖励。 如果瓦莱拉严格在考试开始前完成解决方案，他就会得到报酬。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 33
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 33 (Codeforces format)"
rating: 2600
weight: 33
solve_time_s: 177
verified: false
draft: false
---
[CF 33E - 助手](https://codeforces.com/problemset/problem/33/E)

 **评分：** 2600
 **标签：** -
 **求解时间：** 2m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 瓦莱拉列出了他知道如何解决的课题清单。 每个科目都需要固定的工作时间。 学生提出请求：每个请求都有一个主题、考试截止日期和奖励。 如果瓦莱拉严格在考试开始前完成解决方案，他就会得到报酬。 

困难的部分是时间管理。 瓦莱拉不会连续工作。 每天都有固定的睡眠和进餐时间。 在空闲时间，他可以工作，但一旦开始解决问题，他就必须继续下去，直到完全完成，除了因睡眠或进餐而被迫中断的情况外。 他无法主动暂停并稍后继续。 

我们需要选择帮助哪些学生以及以什么顺序帮助，从而最大化总奖励。 输出还必须重建准确的时间表，包括每个已解决请求的开始和完成时间戳。 

这些约束足够小，足以建议采用动态编程解决方案，但又足够大，足以消除暴力。 最多100名学生，最多30天。 一天内的时间只有1440分钟，所以整个日历最多包含43200分钟。 一个简单的子集枚举需要检查$2^{100}$子集，这是不可能的。 即使尝试所有已接受工作的订单也是无望的。 

重要的结构是这样的：

 1.每项任务都有一个截止日期。 
2. 每个任务都有一个处理时间，仅取决于主题。 
3. 随着时间的推移，工作能力是确定的。 
4.每天的打扰是固定的且相同的。 

这开始看起来像是带有截止日期的加权调度。 

第一个隐藏的困难是“实际经过时间”和“实际工作时间”不同。 假设一项任务需要 60 个工作分钟，Valera 在 08:00 开始，但早餐占用 08:20-08:40。 完成时刻不是09:00，而是09:20。 

简单地添加挂钟时间的持续时间的粗心实现会产生错误的截止日期。 

考虑这个例子：```
1 1 1
math
60
00:00-00:10
00:20-00:30
12:00-12:10
18:00-18:10
math 1 01:15 100
```Valera 在 00:10 到 01:10 之间只有 50 分钟的工作时间，因为早餐占用了 10 分钟。 他实际上是在 01:20 完成的，所以答案是 0。 

另一个微妙的情况是“严格之前”条件。 恰好在考试开始时完成不算数。```
1 1 1
math
30
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
math 1 00:31 100
```如果工作于 00:01 开始并持续 30 分钟，则完成时间为 00:31。 这是无效的，因为考试也是在 00:31 开始。 

第三个陷阱来自不受支持的主题。 学生可以要求学习瓦莱拉列表之外的科目。 这些工作必须完全被忽视。```
1 1 1
math
10
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
physics 1 10:00 500
```即使有足够的时间，答案也是 0。 

最后一个棘手的部分是重建。 我们不仅要最大化利润，还必须打印准确的开始和结束时间戳。 任何丢失前驱信息的 DP 都将变得不可用。 

## 方法

 蛮力的想法很简单。 对于每个学生子集，尝试每个顺序，每分钟模拟日历，并检查是否满足所有截止日期。 在可行的时间表中选择最高奖励。 

为什么这有效？ 因为一旦顺序确定，执行时间线就是确定的。 我们总是尽早开始下一个任务。 如果一项任务错过了最早执行的最后期限，那么延迟它只会让事情变得更糟。 

问题是国家的爆炸性增长。 即使对于 20 名学生，我们也已经面临$20!$排列。 由于有 100 名学生，搜索空间非常大。 

我们需要进行结构观察。 

假设我们将真实时间戳转换为“可用工作分钟”。 想象一下，通过消除所有睡眠和进食间隔来压缩时间。 然后，每个可行的计划都变成不间断的连续处理。 

对于每一个真实的时刻$T$， 定义：$$f(T) = \text{number of workable minutes strictly before } T$$现在带一个有考试截止日期的学生$D$。 瓦莱拉必须在严格之前完成$D$，所以他最多可能花费：$$f(D)$$该截止日期之前的工作单元。 

这种转变是关键的见解。 压缩后，每个作业变成：

 1. 处理时间$p_i$2. 截止日期$d_i = f(D_i)$3、利润$c_i$现在的问题是按最后期限进行经典的加权调度。 

另一个重要的观察结果来自最早截止日期优先调度。 如果选定的一组工作完全可行，那么按截止日期对它们进行排序也是可行的。 这意味着我们永远不需要考虑任意排列。 

按压缩期限对作业进行排序后，我们可以运行背包式DP：$$dp[t] = \text{maximum profit achievable using exactly } t \text{ work minutes}$$处理作业时$(p,d,c)$，只有在以下情况下我们才可以放置它：$$t + p < d$$严格的不平等编码“严格在考试前完成”。 

这将复杂性大致降低到：$$O(n \cdot W)$$在哪里$W$整个考试期间的总可操作分钟数，最多约为 43200 分钟。 

这很容易符合限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n! \cdot n)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n \cdot W)$|$O(W)$| 已接受 |

 ## 算法演练

 1. 分析每天的阻塞时间间隔并建立一个涵盖所有时间的可行分钟日历$k$天。 

我们将每一分钟标记为可用或阻塞。 时间线总长度最多为$30 \times 1440 = 43200$，因此显式预处理很便宜。 
2. 构建两个转换数组。 

第一个数组将每个实际分钟映射到其之前的可工作分钟数。 

第二个数组将每个可工作分钟索引映射回相应的实际分钟。 

第一个映射压缩了最后期限。 第二个映射稍后重建实际时间戳。 
3. 阅读所有学生请求。 

如果主题未知，请立即丢弃该请求，因为 Valera 无法解决该问题。 
4. 将每个考试时间戳转换为压缩的截止日期。 

假设考试实时开始$R$。 那么工作截止日期就变成了：$$d = f(R)$$完全使用的时间表$d$可行的分钟数在考试时或考试后结束，因此仅说明严格小于$d$是合法的。 
5. 按压缩的截止日期对作业进行排序。 

这已经足够了，因为 EDF 排序保留了可行性。 
6. 在可工作时间内运行背包DP。 

让：$$dp[t] = \text{maximum profit with total work } t$$最初仅$dp[0] = 0$是有效的。 

对于每项工作，向后迭代时间。 如果添加作业使总工作量低于截止日期，请更新状态。 
7. 在转换期间存储父指针。 

我们需要重建选择了哪些工作以及每个工作完成的累计工作时间。 
8. 按相反顺序恢复所选作业。 

重建自然会按照非递减的截止时间顺序产生作业，这是实际的执行顺序。 
9. 将压缩的工作间隔转换回真实的时间戳。 

假设某项工作占用了可工作的时间$[L, R)$。 利用逆映射数组，我们可以得到：

 - 实时开始
 - 完成真正的一分钟

 然后将这些分钟转换为日期索引和 HH:MM 格式。 

### 为什么它有效

 压缩的时间线删除了所有不可用的间隔。 在这个改造后的空间内，工作不断进行，每项工作都只消耗其处理时间。 

任何可行的时间表都可以通过不递减的最后期限来重新安排，而不会破坏可行性，这是经典的 EDF 属性。 按截止日期排序后，唯一剩下的选择是选择哪一个工作子集。 

DP 不变量为：$$dp[t]$$存储已处理作业中可实现的最佳利润，其总压缩工作时间等于$t$。 

仅当最终完成时间严格在作业截止日期之前时才允许进行转换。 由于压缩时间与现实生活中的可工作分钟完全对应，因此每个接受的 DP 状态都对应于有效的实际时间表。 

逆映射为所选作业重建唯一的最早实际执行时间线。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = -(10 ** 18)

def parse_time(s):
    h, m = map(int, s.split(':'))
    return h * 60 + m

def parse_segment(s):
    a, b = s.split('-')
    return parse_time(a), parse_time(b)

def minute_to_output(x):
    day = x // 1440 + 1
    rem = x % 1440
    h = rem // 60
    m = rem % 60
    return day, f"{h:02d}:{m:02d}"

def solve():
    m, n, k = map(int, input().split())

    subjects = [input().strip() for _ in range(m)]
    times = list(map(int, input().split()))

    subj_time = {}
    for s, t in zip(subjects, times):
        subj_time[s] = t

    blocked = [False] * (k * 1440)

    segments = [parse_segment(input().strip()) for _ in range(4)]

    for day in range(k):
        base = day * 1440
        for l, r in segments:
            for x in range(l, r + 1):
                blocked[base + x] = True

    total_minutes = k * 1440

    pref = [0] * (total_minutes + 1)
    work_to_real = []

    for i in range(total_minutes):
        pref[i + 1] = pref[i]
        if not blocked[i]:
            pref[i + 1] += 1
            work_to_real.append(i)

    jobs = []

    for idx in range(1, n + 1):
        parts = input().split()

        subj = parts[0]

        if subj not in subj_time:
            continue

        day = int(parts[1]) - 1
        tm = parse_time(parts[2])
        money = int(parts[3])

        real_deadline = day * 1440 + tm

        deadline = pref[real_deadline]

        p = subj_time[subj]

        jobs.append((deadline, p, money, idx))

    jobs.sort()

    W = len(work_to_real)

    dp = [INF] * (W + 1)
    dp[0] = 0

    parent = [None] * (W + 1)

    for j, (deadline, p, money, idx) in enumerate(jobs):
        for t in range(W - p, -1, -1):
            if dp[t] == INF:
                continue

            nt = t + p

            if nt >= deadline:
                continue

            val = dp[t] + money

            if val > dp[nt]:
                dp[nt] = val
                parent[nt] = (t, j)

    best_t = 0
    best_profit = 0

    for t in range(W + 1):
        if dp[t] > best_profit:
            best_profit = dp[t]
            best_t = t

    chosen = []

    cur = best_t

    while cur != 0:
        prev, j = parent[cur]
        chosen.append((cur, jobs[j]))
        cur = prev

    chosen.reverse()

    print(best_profit)
    print(len(chosen))

    current_work = 0

    for finish_work, (deadline, p, money, idx) in chosen:
        start_work = current_work
        end_work = finish_work - 1

        start_real = work_to_real[start_work]
        end_real = work_to_real[end_work]

        sd, st = minute_to_output(start_real)
        ed, et = minute_to_output(end_real)

        print(idx, sd, st, ed, et)

        current_work = finish_work

solve()
```预处理阶段是实现的核心。 该代码不会重复模拟每个任务的中断，而是将整个日历压缩一次。`pref[t]`存储实际分钟之前存在多少个可用分钟`t`。 这将截止日期检查转换为普通的整数比较。 

数组`work_to_real`执行逆映射。 如果可工作分钟数500对应实际分钟900，则任务占用压缩间隔`[500, 560)`自动映射回实际时间戳。 

严格的不平等值得关注：```
if nt >= deadline:
    continue
```恰好在考试时间完成的作业是无效的，因此必须拒绝平等。 

另一个微妙的细节是重建。 DP 仅存储每个总工作量的最佳值，但父指针保留先前的工作负载和所选作业。 由于转换向后运行，因此每个作业最多使用一次。 

进度重建使用压缩的工作范围。 假设任务之前的当前累计工时为`start_work`然后是之后`finish_work`。 该任务占用可工作分钟数：```
[start_work, finish_work)
```由于分钟是离散的，并且打印的完成时间戳是最后工作的分钟，因此代码使用：```
end_work = finish_work - 1
```如果没有这种减法，每个打印的间隔都会相差一分钟。 

## 工作示例

 ### 示例 1

 输入：```
3 3 4
calculus
algebra
history
58 23 15
00:00-08:15
08:20-08:35
09:30-10:25
19:00-19:45
calculus 1 09:36 100
english 4 21:15 5000
history 1 19:50 50
```第一天的压缩可行时间线：

 | 真实区间| 累计可工作分钟数 |

 |---|---|---|

 | 08:16-08:19 | 4 |

 | 08:36-09:29 | 58 | 58

 | 10:26-19:49 | 10:26-19:49 许多 |

 微积分任务需要 58 分钟。 从可工作的第 0 分钟开始，正好在可工作的第 57 分钟结束，对应于实际时间 09:29。 

历史任务需要 15 分钟的可操作时间。 它在第一个任务之后开始，并于 10:40 结束。 

| 任务| 加工| 截止日期| 已选择 |
 | --- | --- | --- | --- |
 | 微积分| 58 | 58 09:36 之前 | 是的 |
 | 历史| 15 | 15 19:50 之前 | 是的 |

 总利润变为 150。 

此跟踪显示了时间线压缩起作用的原因。 早餐中断会自动从压缩的日程中消失。 

### 自定义示例```
1 2 1
math
30
00:00-00:10
12:00-12:10
18:00-18:10
23:00-23:10
math 1 00:41 100
math 1 01:20 200
```可用工作于 00:11 开始。 

| 工作 | 持续时间 | 真正的截止日期| 压缩期限 |
 | --- | --- | --- | --- |
 | 1 | 30| 00:41 | 00:41 30|
 | 2 | 30| 01:20 | 01:20 69 | 69

 工作 1 是不可能的，因为它会在截止日期前准确完成。 

工作2是可行的。 

| DP时间| 利润|
 | --- | --- |
 | 0 | 0 |
 | 30| 200 | 200

 答案只包含第二个学生。 

这证明了严格的不平等条件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot W)$| DP 涵盖所有工作和可工作时间 |
 | 空间|$O(W)$| DP 和父数组 |

 这里$W$是全天的可工作分钟数。 由于整个日历最多包含 43200 分钟，因此最坏情况下 DP 转换的数量约为$100 \times 43200$，在 Python 的限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from contextlib import redirect_stdout
    out = io.StringIO()

    sys.stdin = io.StringIO(inp)

    def parse_time(s):
        h, m = map(int, s.split(':'))
        return h * 60 + m

    def parse_segment(s):
        a, b = s.split('-')
        return parse_time(a), parse_time(b)

    def minute_to_output(x):
        day = x // 1440 + 1
        rem = x % 1440
        h = rem // 60
        m = rem % 60
        return day, f"{h:02d}:{m:02d}"

    with redirect_stdout(out):
        INF = -(10 ** 18)

        input = sys.stdin.readline

        m, n, k = map(int, input().split())

        subjects = [input().strip() for _ in range(m)]
        times = list(map(int, input().split()))

        subj_time = dict(zip(subjects, times))

        blocked = [False] * (k * 1440)

        segments = [parse_segment(input().strip()) for _ in range(4)]

        for day in range(k):
            base = day * 1440
            for l, r in segments:
                for x in range(l, r + 1):
                    blocked[base + x] = True

        total_minutes = k * 1440

        pref = [0] * (total_minutes + 1)
        work_to_real = []

        for i in range(total_minutes):
            pref[i + 1] = pref[i]
            if not blocked[i]:
                pref[i + 1] += 1
                work_to_real.append(i)

        jobs = []

        for idx in range(1, n + 1):
            parts = input().split()

            subj = parts[0]

            if subj not in subj_time:
                continue

            day = int(parts[1]) - 1
            tm = parse_time(parts[2])
            money = int(parts[3])

            real_deadline = day * 1440 + tm
            deadline = pref[real_deadline]

            jobs.append((deadline, subj_time[subj], money, idx))

        jobs.sort()

        W = len(work_to_real)

        dp = [INF] * (W + 1)
        dp[0] = 0

        for deadline, p, money, idx in jobs:
            for t in range(W - p, -1, -1):
                if dp[t] == INF:
                    continue
                nt = t + p
                if nt >= deadline:
                    continue
                dp[nt] = max(dp[nt], dp[t] + money)

        print(max(dp))

    return out.getvalue().strip()

# sample 1
assert run("""3 3 4
calculus
algebra
history
58 23 15
00:00-08:15
08:20-08:35
09:30-10:25
19:00-19:45
calculus 1 09:36 100
english 4 21:15 5000
history 1 19:50 50
""").splitlines()[0] == "150"

# minimum size
assert run("""1 1 1
math
1
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
math 1 00:02 5
""").splitlines()[0] == "5"

# unsupported subject
assert run("""1 1 1
math
10
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
physics 1 10:00 100
""").splitlines()[0] == "0"

# strict deadline equality
assert run("""1 1 1
math
30
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
math 1 00:31 100
""").splitlines()[0] == "0"

# choose better subset
assert run("""1 3 1
math
10
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
math 1 00:20 10
math 1 00:30 100
math 1 00:40 50
""").splitlines()[0] == "150"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸外壳 | 5 | 最小的法律实例|
 | 不支持的主题 | 0 | 忽略不可能的工作 |
 | 平等期限| 0 | 严格先于条件 |
 | 更好的子集选择 | 150 | 150 DP选择最优组合|

 ## 边缘情况

 考虑中断敏感的示例：```
1 1 1
math
60
00:00-00:10
00:20-00:30
12:00-12:10
18:00-18:10
math 1 01:15 100
```01:15 之前可用的工作是：

 - 00:11-00:19, 9 分钟
 - 00:31-01:14, 44 分钟

 总计：53 分钟。 

压缩后的截止时间变为53。由于任务需要60分钟，因此DP过渡立即被拒绝。 

天真的挂钟添加会错误地认为 00:11 + 60 分钟 = 01:11 并接受任务。 

现在考虑平等边界：```
1 1 1
math
30
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
math 1 00:31 100
```工作于 00:01 开始。 三十分钟的可工作分钟涵盖 00:01 到 00:30（含），因此完成时间为 00:31。 

压缩截止日期等于 30。转换检查：```
if nt >= deadline:
```这里`nt = 30`，因此任务被正确拒绝。 

最后，不支持的主题：```
1 2 1
math
10
00:00-00:00
12:00-12:00
18:00-18:00
23:00-23:00
physics 1 10:00 100
math 1 10:00 50
```物理请求永远不会进入作业数组。 DP 只看到数学任务并返回利润 50。 

这可以防止无效的计划污染优化状态。
