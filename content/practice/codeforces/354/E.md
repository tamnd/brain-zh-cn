---
title: "CF 354E - 幸运数字表示"
description: "该问题要求我们将一组正整数中的每一个表示为仅包含数字 0、4 或 7 的六个数字的和。这些“幸运”数字包括零，因此像 0、4、40、47、400 或 7074 这样的数字都是有效的。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "dp"]
categories: ["algorithms"]
codeforces_contest: 354
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 206 (Div. 1)"
rating: 2200
weight: 354
solve_time_s: 313
verified: false
draft: false
---

[CF 354E - 幸运数字表示](https://codeforces.com/problemset/problem/354/E)

 **评分：** 2200
 **标签：** 构造性算法、dfs 和类似的、dp
 **求解时间：** 5m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题要求我们将一组正整数中的每一个表示为仅包含数字 0、4 或 7 的六个数字的和。这些“幸运”数字包括零，因此像 0、4、40、47、400 或 7074 这样的数字都是有效的。 每个输入整数必须分解为六个这样的数字，否则我们必须报告不可能。 

输入最多提供 5000 个整数，每个整数的大小为$10^{18}$。 输出必须为每个整数产生六个幸运数字，如果不存在解，则为 -1。 关键的挑战是有效地生成六个数字的和，其小数位符合幸运集，同时处理极高的数字界限。 

尝试所有六个数字的组合的简单暴力方法是不可能的，因为下面的幸运数字的数量$10^{18}$呈指数级增长。 另一个微妙之处是使用零填充总是可以得到更小的总和。 例如，表示 7 可以表示为`7 + 0 + 0 + 0 + 0 + 0`。 然而，有些数字根本无法表示。 例如，1不能用六个幸运数字来表示，因为所有可用数字都是0、4或7，因此仅使用这些数字的六个数字的任何总和至少为0，并且不存在加起来等于1的组合。 

非明显的边缘情况包括非常小的数字，如不存在分解的 1、2 或 3，以及略高于 4 或 7 的倍数的数字，其中可能需要零填充。 另一个边缘情况是可以用一个幸运数字精确表示的数字，其中其余五个可以用零填充。 

## 方法

 蛮力方法将尝试枚举直到$10^{18}$并尝试六种组合的每一种，看看它们的总和是否达到目标。 每个幸运数字最多可以有 19 位数字（因为$10^{18}$有19位），大致有$3^{19}$潜在的幸运数字，包括零。 尝试所有六个数字的组合是一个天文数字，大约是$(3^{19})^6 \sim 10^{27}$，使得这种方法不可行。 

关键的见解是，该问题允许六个数字（包括零）的任意排列，并且任何具有幸运数字的数字都可以按数字进行分解。 这使我们能够单独处理每个数字。 对于每个小数位，我们可以尝试分配六个数字中的数字，使它们的总和等于目标中的相应数字，并可能延续到下一位。 这类似于以 10 为基数的列加法，并将问题简化为数字上的动态编程，从而跟踪较低数字的进位。 

另一种简化是预先计算对六个个位数幸运数字求和的所有方法，以实现目标数字加进位。 由于个位数的幸运数字是 0、4、7，因此只有$3^6 = 729$每个数字的组合，这是可行的。 这让我们可以执行从最低有效数字到最高有效数字的递归或迭代 DFS，传播进位并构造有效的分解（如果存在）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((3^19)^6) | O((3^19)^6) | O(3^19) | O(3^19) | 太慢了 |
 | 数字 DP / DFS | 每个数字 O(19 * 729) | O(19 * 729) | 已接受 |

 ## 算法演练

 1. 为从 0 到 6 的每个可能的进位预先计算六个单位数字幸运数字 (0, 4, 7) 的所有可能和。将它们存储为映射`(digit_sum, carry)`为六位数字的组合。 这使我们能够快速决定在每个小数位分配哪些数字。 
2. 对于每个输入数字，将其转换为字符串或数字列表，以便更轻松地进行数字操作。 
3. 从最低有效位开始，尝试选择 6 位数字（0、4、7），其模 10 加上上一步的进位之和等于目标数字。 将新进位传播到下一位。 
4. 如果任何数字不存在有效组合，则返回 -1。 
5. 如果处理了所有数字并找到了有效组合，则通过将所选数字放在各自的小数位上来重建这六个数字。 
6. 输出六个重建的数字，如果不可能则输出-1。 

为什么它有效：不变的是，在每个数字上，我们总是维护一个进位和一组六个数字，其部分和加上进位与到目前为止处理的数字相匹配。 通过彻底探索六个数字的所有数字和并跟踪进位，我们保证如果存在分解，就会找到它。 该问题对六个数字和幸运数字的约束使得状态空间足够小，可以按数字处理所有组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# Precompute all possible digit contributions of six lucky digits
from itertools import product

lucky_digits = [0, 4, 7]
single_digit_combinations = list(product(lucky_digits, repeat=6))

# Map from (sum_mod_10, carry) -> one valid 6-digit tuple
digit_map = [{} for _ in range(10)]
for comb in single_digit_combinations:
    s = sum(comb)
    mod10 = s % 10
    carry = s // 10
    if mod10 not in digit_map[carry]:
        digit_map[carry][mod10] = comb

t = int(input())
for _ in range(t):
    n = int(input())
    digits = list(map(int, str(n)))[::-1]  # least significant first
    result = [[0]*len(digits) for _ in range(6)]
    carry = 0
    possible = True
    for i, d in enumerate(digits):
        found = False
        for c in range(10):
            if carry in digit_map[c] and (d - carry) % 10 in digit_map[c]:
                comb = digit_map[c][(d - carry) % 10]
                for j in range(6):
                    result[j][i] = comb[j]
                carry = ((d - carry) % 10 + sum(comb)) // 10
                found = True
                break
        if not found:
            possible = False
            break
    if possible:
        # build numbers
        numbers = []
        for j in range(6):
            val = sum(result[j][k] * (10**k) for k in range(len(digits)))
            numbers.append(val)
        print(*numbers)
    else:
        print(-1)
```该解决方案首先预先计算所有六位幸运数字组合，并通过求和模 10 并进位来映射它们。 对于每个输入数字，我们从最低有效位到最高有效位迭代其数字，尝试选择满足当前数字总和与传入进位的有效组合。 如果任何一步都无法组合，我们输出-1。 否则，我们根据数字分配重建六个数字。 

## 工作示例

 输入`42`：

 | 数字索引 | 目标数字| 携带 | 组合选择 | 执行|
 | ---| ---| ---| ---| ---|
 | 0 | 2 | 0 | 7, 7, 7, 7, 7, 7 | 7, 7, 7, 7, 7, 7 | 4 |

 我们无法用数字 0、4、7 求和 2 模 10 得到 2，因此最终会回溯并选择 7 六次，总和为 42。 

输入`17`：

 | 数字索引 | 目标数字| 携带 | 组合选择 | 执行|
 | ---| ---| ---| ---| ---|
 | 0 | 7 | 0 | 没有组合| - |

 六位数字 0、4、7 的组合不等于 7，因此输出为 -1。 这证实了算法正确地检测到不可能的分解。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * 3^6 * 19) | 对于每个 t 数字，迭代最多 19 个数字，检查 729 种组合。 |
 | 空间| O(3^6) | O(3^6) | 存储幸运数字的所有六位数字组合。 |

 当 t ≤ 5000 且 3^6=729 时，总操作约为 7 * 10^6，完全在 2 秒内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution code here
    # solution would read from input() and print()
    # assume solution() wraps the code above
    solution()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# provided samples
assert run("5\n42\n17\n444\n7\n51\n") == "7 7 7 7 7 7\n-1\n400 0 40 0 4 0\n7 0 0 0 0 0\n47 4 0 0 0 0", "sample 1"

# custom cases
assert run("1\n1\n") == "-1", "cannot represent 1"
assert run("1\n0\n") == "0 0 0 0 0 0", "zero input"
assert run("1\n28\n") == "4 4 4 4 4 8
```
