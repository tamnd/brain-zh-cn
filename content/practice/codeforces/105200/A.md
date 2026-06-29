---
title: "CF 105200A - 阵列问题"
description: "给定一个整数数组，任务是在从左向右扩展数组时重复评估经典的“最大子数组”数量。"
date: "2026-06-27T02:52:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105200
codeforces_index: "A"
codeforces_contest_name: "IME++ Starters Try-outs 2024"
rating: 0
weight: 105200
solve_time_s: 55
verified: true
draft: false
---

[CF 105200A - 数组问题](https://codeforces.com/problemset/problem/105200/A)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数数组，任务是在从左向右扩展数组时重复评估经典的“最大子数组”数量。 对于数组的每个前缀，我们想知道完全位于该前缀内的任何连续子数组的最佳可能总和。 输出是这些最佳值的序列，每个前缀对应一个。 

阅读任务的另一种方法是我们模拟一次显示数组一个元素。 看到第一个元素后，我们计算该单个元素的最大子数组和。 查看前两个元素后，我们重新计算这两个元素的最大子数组和。 这将持续到处理完整个数组为止。 

关键的约束含义是对每个前缀进行直接重新计算会太慢。 如果数组长度达到典型的竞争性编程限制（例如 100000），则重新计算每个前缀的完整 Kadane 扫描会导致 O(n²) 行为，这远远超出了可接受的范围。 我们需要维护增量状态，以便每个新元素在恒定时间内更新答案。 

常见的边缘情况是所有数字均为负数。 例如，如果数组为 [-5, -2, -8]，则每个前缀的答案是迄今为止看到的最大单个元素，而不是零。 将负数重置为零的简单 Kadane 实现会错误地输出零，如果不允许空子数组，则这些零不是有效的子数组和。 

另一个微妙的情况是前缀的最佳子数组正好在当前位置结束。 例如，在 [3, -10, 4] 中，前缀答案演变为 3, 3, 4。任何只跟踪全局最佳而不正确维护“此处最佳结束”状态的方法都将在转换时失败，因为在当前元素处重新启动比扩展更好。 

## 方法

 暴力方法独立地重新计算每个前缀的最大子数组和。 对于每个以索引 i 结尾的前缀，我们扫描以 i 或 i 之前结尾的所有子数组并计算它们的总和。 直接实现尝试所有 r ≤ i 的对 (l, r)，导致每个前缀的工作时间为 O(n²)，如果通过求和简单地实现，则总体工作时间为 O(n³)。 即使前缀和将范围和查询减少到 O(1)，每个前缀仍然有 O(n²) 个子数组，这使得它不可行。 

这是浪费的原因是相邻前缀共享几乎所有结构。 当从前缀 i 移动到前缀 i+1 时，我们仅添加一个新元素，但强力会从头开始重新计算所有内容，而不是更新以前的结果。 

关键的观察结果是，Kadane 的算法已经准确地维护了此过程所需的两条信息：以当前位置结束的最佳子数组和，以及迄今为止看到的最佳子数组和。 通过决定是扩展前一个子数组还是从当前元素开始，可以在 O(1) 中更新第一个值。 第二个值只是一段时间内的最大值。 

通过在迭代时保持这两种状态，我们自然会为每个前缀生成答案，而无需重新计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 或 O(n³) | O(1) | O(1) | 太慢了 |
 | 每个前缀的最佳 Kadane | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

1. 初始化两个变量，一个用于跟踪以当前索引结尾的最佳子数组总和，另一个用于跟踪迄今为止看到的最佳答案。 第一个必须从第一个元素开始，因为不允许使用空子数组。 
2. 从左到右迭代数组，一次处理一个元素。 在每一步中，我们决定是扩展前一个子数组还是在当前元素处开始一个新子数组。 
3. 将“此处最佳结局”值更新为当前元素与前一个最佳结局加上当前元素之间的最大值。 这种选择反映了连续性是有益还是有害。 
4. 将全局最佳值更新为其当前值和新计算的“最佳结局”之间的最大值。 
5. 每次迭代后输出全局最佳值，因为此时它代表当前前缀的最大子数组和。 

### 为什么它有效

 该算法保持精确的不变量：在处理索引 i 后，跟踪“最佳在此结束”的变量等于必须恰好在 i 处结束的任何子数组的最大和，而全局最佳等于完全包含在前缀 [0, i] 中的任何子数组的最大和。 任何以 i 结尾的子数组要么扩展以 i-1 结尾的子数组，要么以 i 开头，因此转换捕获了所有可能性。 由于每个子数组都有唯一的结束位置，因此每个候选子数组在成为“此处结束”状态时仅被考虑一次，从而确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    data = input().strip().split()
    if not data:
        return
    n = int(data[0])
    arr = list(map(int, data[1:]))

    # In case input is split across lines
    if len(arr) < n:
        while len(arr) < n:
            arr.extend(map(int, input().split()))

    best_ending = arr[0]
    best_global = arr[0]

    out = [str(best_global)]

    for i in range(1, n):
        x = arr[i]

        best_ending = max(x, best_ending + x)
        best_global = max(best_global, best_ending)

        out.append(str(best_global))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案首先仔细读取整个数组，包括第一行可能不包含所有元素的情况。 当输入混合有空格或换行符时，这是一个常见的竞争性编程陷阱。 

变量`best_ending`对应于必须在当前位置结束的最佳子数组和。 更新内容`max(x, best_ending + x)`直接编码重新启动或延长的决定。 变量`best_global`跟踪迄今为止在所有前缀中看到的最佳结果，并在每次更新后附加以生成所需的输出序列。 

一个微妙的细节是初始化。 两个变量都从第一个元素开始，而不是零，因为子数组必须至少包含一个元素。 

## 工作示例

 考虑数组 [3, -2, 5]。 

| 我| 价值| 最佳结局 | 最佳全球 | 输出|
 | --- | --- | --- | --- | --- |
 | 0 | 3 | 3 | 3 | 3 |
 | 1 | -2 | 最大值(-2, 3 + -2 = 1) = 1 | 3 | 3 |
 | 2 | 5 | 最大(5, 1 + 5 = 6) = 6 | 6 | 3 3 6 | 3 3 6

 该跟踪显示负值不会重置所有内容，而只会在扩展仍然有益的情况下减少最终总和。 全局答案保持稳定，直到出现更好的子数组。 

现在考虑[-1,-2,-3]。 

| 我| 价值| 最佳结局 | 最佳全球 | 输出|
 | --- | --- | --- | --- | --- |
 | 0 | -1 | -1 | -1 | -1 |
 | 1 | -2 | 最大值（-2，-1 + -2 = -3）= -2 | -1 | -1 |
 | 2 | -3 | 最大值(-3, -2 + -3 = -5) = -3 | -1 | -1 |

 这证实了该算法正确地避免了零初始化并保留了最大的负元素。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个元素都以恒定时间转换处理一次 |
 | 空间| O(1) | O(1) | 仅维护两个运行变量 |

 线性时间复杂度对于处理大型数组至关重要，因为对前缀的任何二次重新计算都会超出典型限制几个数量级。 即使在最大输入大小下，恒定的空间使用也可确保内存稳定性。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve
    return solve()

# Since solve() prints directly, we adapt testing by capturing stdout
import contextlib

def run(inp: str) -> str:
    import sys, io
    backup_in = sys.stdin
    backup_out = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = backup_in
        sys.stdout = backup_out

# sample-like cases
assert run("3\n3 -2 5\n") == "3\n3\n6", "basic mixed case"
assert run("3\n-1 -2 -3\n") == "-1\n-1\n-1", "all negative"

# custom cases
assert run("1\n5\n") == "5", "single element"
assert run("5\n1 2 3 4 5\n") == "1\n3\n6\n10\n15", "increasing array"
assert run("4\n-1 5 -1 5\n") == "-1\n5\n5\n9", "alternating gains"
assert run("6\n2 -1 2 -1 2 -1\n") == "2\n2\n3\n3\n4\n4", "repeated interruptions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 元素 | 5 | 基础初始化 |
 | 增加数组| 累计增长| 只积极的行为|
 | 交替增益| 稳定的最大传播| 前缀稳定性 |
 | 反复打扰| 重启与扩展逻辑| 卡丹转变 |

 ## 边缘情况

 对于像 [-5, -1, -3] 这样的输入，算法用 -5 初始化。 在第二个元素之后，它计算 best_ending = max(-1, -5 + -1 = -6) = -1，并且 best_global 仍为 -1。 在第三个元素之后，best_ending = max(-3, -1 + -3 = -4) = -3，并且 best_global 保持 -1。 输出正确地保留了每一步的最佳前缀值，永远不会错误地引入零。 

对于像 [4, -10, 6] 这样的输入，算法首先设置 best_ending = 4，best_global = 4。在索引 1 处，best_ending 变为 max(-10, -6) = -6，但 best_global 仍为 4。在索引 2 处，best_ending 变为 max(6, 0) = 6，将 best_global 更新为 6。这演示了如何通过局部转换规则而不是任何全局重新计算正确捕获第三个元素处的重新启动。
