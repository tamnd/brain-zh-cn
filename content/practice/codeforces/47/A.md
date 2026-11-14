---
title: "CF 47A - 三角数"
description: "我们被要求确定给定的正整数是否可以表示为三角形数。 三角形数是由点排列成等边三角形而形成的，因此第n个三角形数是前n个正整数的和。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math"]
categories: ["algorithms"]
codeforces_contest: 47
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 44 (Div. 2)"
rating: 800
weight: 47
solve_time_s: 70
verified: true
draft: false
---
[CF 47A - 三角数](https://codeforces.com/problemset/problem/47/A)

 **评分：** 800
 **标签：** 蛮力，数学
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定给定的正整数是否可以表示为三角形数。 三角形数是由点排列成等边三角形而形成的，因此第n个三角形数是前n个正整数的和。 例如，前几个三角形数是1、3、6、10、15等。 输入是单个整数`n`1 到 500 之间，输出应该是`YES`如果`n`匹配任何三角形数，否则`NO`。 

自从`n`最多 500，我们可以推断出计算限制。 依次计算每个三角数是可行的，因为第 32 个三角数已经是 528，略高于我们的最大界限。 这告诉我们问题足够小，可以进行简单的迭代。 粗心的方法可能会尝试使用浮点除法来反转三角数公式，这可能会对 1、3 或 6 等小整数产生差一误差。例如，如果我们错误计算了二次公式的判别式，我们可能会错误地得出 1 不是三角形的结论。 

边缘情况包括`n = 1`,`n = 500`，以及三角形数字正下方或上方的数字，例如 5（3 到 6 之间）。 

## 方法

 最简单的方法是依次生成三角数并将每个三角数与`n`。 从 1 开始，然后 1 + 2 = 3，然后 1 + 2 + 3 = 6，依此类推，直到匹配`n`或超过它。 这是可行的，因为三角形数单调增加，所以一旦我们超过`n`没有机会找到匹配的人。 

这种简单的方法实际上已经足够了，因为最大`n`是 500。最坏情况下的迭代次数约为 32，因为三角形数大致呈二次方增长（`k(k+1)/2 ≤ 500`）。 这远远低于 2 秒时间限制的任何合理限制。 

另一种方法是使用封闭式公式`k(k+1)/2 = n`并解决`k`使用二次公式。 这需要检查解是否是正整数。 While mathematically elegant, this introduces floating-point operations or careful integer checks and risks rounding issues, so for this problem the iterative approach is simpler, safer, and completely adequate.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(√n) | O(√n) | O(1) | O(1) | 已接受 |
 | 二次公式 | O(1) | O(1) | O(1) | O(1) | 已接受，但太过分了|

 ## 算法演练

 1. 初始化变量`current`到1，代表当前的三角数，还有一个变量`increment`至 2. 变量`increment`跟踪下一个要添加的数字以形成下一个三角形数字。 
2. 循环 while`current`小于或等于`n`。 在每次迭代中，检查是否`current`等于`n`。 如果是，则打印`YES`并终止程序。 
3.如果`current`不等于`n`， 添加`increment`到`current`得到下一个三角数，并递增`increment`乘 1。这模拟形成序列 1、3、6、10 等，而无需从头开始计算总和。 
4. 如果循环退出而没有找到匹配项，则打印`NO`。 

这样做的原因是三角形数严格单调增长。 通过迭代构建它们，我们保证如果`n`是三角形的，我们会准确地击中它； 如果我们超调，则没有三角数等于`n`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

current = 1
increment = 2

while current <= n:
    if current == n:
        print("YES")
        break
    current += increment
    increment += 1
else:
    print("NO")
```代码直接遵循算法。`current`从第一个三角形数 1 开始，并且`increment`从 2 开始。循环添加`increment`到`current`每次，生成连续的三角形数。 这`else`条款关于`while`仅当循环自然退出而没有`break`，这确保了`NO`如果没有找到匹配则打印。 这可以避免差一错误和不必要的检查。 

## 工作示例

 考虑`n = 1`：

 | 当前| 增量| 条件当前 == n？ |
 | --- | --- | --- |
 | 1 | 2 | 是 |

 第一个三角形数字立即匹配。 

考虑`n = 5`：

 | 当前| 增量| 条件当前 == n？ |
 | --- | --- | --- |
 | 1 | 2 | 否 |
 | 3 | 3 | 否 |
 | 6 | 4 | 循环结束|

 循环结束是因为`current`超过`n`。 程序打印出`NO`，正确识别 5 不是三角形。 

这些痕迹证实了循环不变式：`current`始终等于第一个的总和`increment-1`数字，我们检查每个三角形数字`n`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(√n) | O(√n) | 最大三角数 ≤ n 大致为 √(2n)，因此循环大约运行 √(2n) 次迭代。 |
 | 空间| O(1) | O(1) | 仅使用两个整数变量，与输入大小无关。 |

 和`n ≤ 500`，循环最多执行 32 次，远低于 2 秒的限制。 内存使用量微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        n = int(input())
        current = 1
        increment = 2
        while current <= n:
            if current == n:
                print("YES")
                break
            current += increment
            increment += 1
        else:
            print("NO")
    return out.getvalue().strip()

# provided samples
assert run("1\n") == "YES", "sample 1"
assert run("3\n") == "YES", "sample 2"

# custom cases
assert run("5\n") == "NO", "between triangular numbers"
assert run("6\n") == "YES", "triangular number"
assert run("500\n") == "NO", "upper bound non-triangular"
assert run("36\n") == "YES", "exact triangular number"
assert run("37\n") == "NO", "just above a triangular number"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 是 | 最小输入|
 | 5 | 否 | 三角形数之间 |
 | 500 | 500 否 | 上限 |
 | 36 | 36 是 | 典型的三角数|
 | 37 | 37 否 | 比三角形数少一 |

 ## 边缘情况

 对于`n = 1`，循环立即检测到`current == n`和打印`YES`。 这确保了算法正确处理最小三角数。 为了`n = 500`，三角形数序列超过 500 时`current = 528`。 循环自然退出并打印`NO`，正确识别 500 不是三角形。 刚好低于或刚好高于三角形数的情况证实了循环不变性：每个三角形数仅被访问一次，并且超调保证`NO`返回没有错误。
