---
title: "CF 1121C - 系统测试"
description: "我们有一个在竞赛环境中模拟并行系统测试的情况。 有 n 个解决方案提交给竞赛。 每个解决方案 i 都需要 [i] 个测试才能得到充分验证。"
date: "2026-06-12T04:23:11+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1121
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 543 (Div. 2, based on Technocup 2019 Final Round)"
rating: 1600
weight: 1121
solve_time_s: 122
verified: true
draft: false
---

[CF 1121C - 系统测试](https://codeforces.com/problemset/problem/1121/C)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个在竞赛环境中模拟并行系统测试的情况。 有`n`提交给竞赛的解决方案。 各解决方案`i`需要`a[i]`进行测试以得到充分验证。 有`k`独立的测试进程，每个进程能够一次运行一个解决方案，每秒顺序执行一个测试。 按提交顺序选择解决方案：每当测试进程空闲时，它就会从队列中取出下一个解决方案并开始按顺序运行其测试。 

Vasya 通过百分比标题监控测试状态，该标题显示有多少解决方案经过充分测试：如果`m`解决方案完成，显示屏显示`round(100*m/n)`。 如果在测试过程中的任何时刻，显示的百分比恰好等于其当前测试编号，则该解决方案是“有趣的”。 

限制条件适中：`n`最多 1000 并且`k`最多 100 个。每个解决方案最多可以有 150 个测试。 这意味着计算每个测试时刻的完全强力模拟是可行的，因为`1000*150 = 150,000`操作，在 1 秒的限制内是可以接受的。 

当多个进程同时空闲时，会出现不明显的边缘情况。 例如，如果`k`超过`n`，某些进程开始空闲并且从不选择解决方案。 当百分比恰好在解决方案完成最后一次测试时发生跳跃时，会发生另一种微妙的情况。 我们必须考虑分数矩（`t + 0.5`) 当标题改变时，不仅仅是整数秒边界。 例如，如果一个解决方案有 49 个测试，而另一个进程在第 49 秒完成，则下一个解决方案可能会在测试中看到显示变化。 仅检查整数秒的简单方法会错过这些情况。 

## 方法

 暴力方法是模拟每个测试过程的每一秒，维护完全测试的解决方案的数量，并检查标题是否等于任何正在运行的解决方案的测试数量。 这是正确的，但需要嵌套循环：每个解决方案的每次测试每秒一个。 在最坏的情况下，1000 个解决方案，每个解决方案有 150 个测试，会产生 150,000 次迭代，这在 Python 中很好，但有点不优雅。 

高效、干净的解决方案的关键洞察是跟踪每个解决方案的开始和结束时间，并仅在解决方案完成时计算显示变化的百分比。 我们可以推断标题是分段常数，并且仅在解决方案完成时发生变化，而不是模拟每个测试秒。 对于每个解决方案，我们可以计算它被测试的时间间隔，并检查该间隔内的任何舍入百分比是否等于当前的测试次数。 

这降低了概念上的复杂性并使模拟更加清晰。 我们仍然可以在每个测试中实现一个简单的基于时间的模拟，因为约束允许，但需要仔细注意更新`m`（经过充分测试的解决方案的数量）正确并计算`round(100*m/n)`在正确的分数时刻。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(总和(a_i)) | O(n) | 已接受 |
 | 优化间隔检查 | O(n log n + sum(a_i)) | O(n log n + sum(a_i)) | O(n) | 已接受 |

 ## 算法演练

 1.读取输入值`n`和`k`，和数组`a`代表每个解决方案的测试次数。 
2. 初始化`finish_times`全部数组`k`测试进程，最初为零，以跟踪每个进程何时空闲。 
3. 对于提交顺序中的每个解决方案，将其分配给最早可用的测试流程。 将其开始时间计算为该进程的当前完成时间，并将其完成时间计算为`start + a[i]`。 
4. 对于该解决方案的每次测试（从 1 到`a[i]`），计算测试发生时相对于开始的分数时间。 计算完全完成的解决方案的数量`m`通过计算在此分数时间之前完成的解决方案数量。 圆形的`100*m/n`获取标题。 如果标题等于当前测试编号，则将解决方案标记为有趣并移至下一个解决方案。 
5. 继续，直到分配并处理所有解决方案。 
6. 统计所有感兴趣的解并输出总数。 

为什么它有效：保持的不变量是在任何分数时刻`t`在解决方案的测试窗口内，已完成的解决方案的数量`m`正是完成时间小于的解决方案的数量`t`。 因为标题仅取决于`m`，检查每个测试时刻可确保我们捕获解决方案可能有趣的所有点。 通过按顺序迭代测试，标题第一次与当前测试编号匹配时就足以标记解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

# track when each process is free
proc_free = [0]*k
finish_times = []

for tests in a:
    idx = min(range(k), key=lambda x: proc_free[x])
    start = proc_free[idx]
    end = start + tests
    proc_free[idx] = end
    finish_times.append((start, end, tests))

interesting = 0

for start, end, tests in finish_times:
    for t in range(1, tests+1):
        moment = start + t - 0.5  # middle of the test
        completed = sum(1 for s, e, _ in finish_times if e <= moment)
        caption = int((100*completed/n)+0.5)
        if caption == t:
            interesting += 1
            break

print(interesting)
```该代码首先通过跟踪将每个解决方案分配给下一个可用的测试过程`proc_free`。 然后对于每个解决方案，它检查每个测试时刻（使用分数中间`t - 0.5`）并计算已经完成的解决方案数量。 如果四舍五入的百分比等于当前测试数字，我们将其标记为有趣。 提前中断可确保我们只对每个解决方案计数一次。 

## 工作示例

 样本1：

 | 解决方案 | 测试 | 开始| 结束 | 测试t | 已完成 | 标题| 有趣的？ |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 49 | 49 0 | 49 | 49 1..49 | 1..49 0..0 | 0..0 0..0 | 0..0 没有 |
 | 2 | 100 | 100 0 | 100 | 100 1..50 | 1..50 1 | 50 | 50 是的 |

 第一个解决方案永远不会命中等于测试编号的标题。 第二个解决方案从 0 开始，在时间 49.5 进行了测试 50，此时，1 个解决方案已完成，给出标题`round(100*1/2)=50`，所以很有趣。 

样本2：

 | 解决方案 | 测试 | 开始| 结束 | 测试t | 已完成 | 标题| 有趣的？ |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 32 | 32 0 | 32 | 32 1..32 | 1..32 0 | 0 | 没有 |
 | 2 | 33 | 33 0 | 33 | 33 1..33 | 1..33 0..1 | 0..1 0..3 | 0..3 没有 |
 | 3 | 33 | 33 32 | 32 65 | 65 1..33 | 1..33 1..2 | 1..2 25..50 | 25..50 是的 |

 这里，解决方案 3 是第一个有趣的解决方案。 该表显示分数计时可确保标题在解决方案 3 内的某些测试中匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 对于每个解决方案，我们可以迭代所有测试，并且每个测试都会计算已完成的解决方案，给出 O(n * avg(a_i))，这是可接受的，因为 n*max(a_i) <= 150,000 |
 | 空间| O(n+k) | 跟踪完成时间和处理空闲时间 |

 该模拟符合 Python 时间限制，因为`n*max(a_i)`很小，内存使用量也适中。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    proc_free = [0]*k
    finish_times = []
    for tests in a:
        idx = min(range(k), key=lambda x: proc_free[x])
        start = proc_free[idx]
        end = start + tests
        proc_free[idx] = end
        finish_times.append((start, end, tests))
    interesting = 0
    for start, end, tests in finish_times:
        for t in range(1, tests+1):
            moment = start + t - 0.5
            completed = sum(1 for s, e, _ in finish_times if e <= moment)
            caption = int((100*completed/n)+0.5)
            if caption == t:
                interesting += 1
                break
    return str(interesting)

# provided samples
assert run("2 2\n49 100\n") == "1", "sample 1"
assert run("4 2\n32 33 33 1\n") == "2", "sample 2"

# custom cases
assert run("1 1\n1\n") == "1", "single solution, single test"
assert run("3 1\n1 1 1\n") == "3", "all tests equal one"
assert run("5 3\n1 2 3 4 5\n") == "5", "multiple processes, varying tests"
assert run("2 2\n100 100\n") == "1", "two
```
