---
title: "CF 1374C - 移动支架"
description: "我们得到一串括号，由一半左括号“(”和一半右括号“)”组成，我们的目标是使其成为有效、平衡的括号序列。"
date: "2026-06-11T11:07:50+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1374
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 653 (Div. 3)"
rating: 1000
weight: 1374
solve_time_s: 102
verified: true
draft: false
---

[CF 1374C - 移动括号](https://codeforces.com/problemset/problem/1374/C)

 **评分：** 1000
 **标签：** 贪心，字符串
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一串括号，由一半左括号“(”和一半右括号“)”组成，我们的目标是使其成为有效、平衡的括号序列。 我们可以一次将单个括号移动到字符串的开头或结尾，并且我们需要最大限度地减少此类移动的次数。 输出只是所需的最小移动次数。 

由于字符串始终具有相同数量的左括号和右括号，因此始终存在解决方案。 输入约束很小：每个字符串的长度最多为 50，测试用例的数量最多为 2000。这使得算法的时间复杂度约为$O(n)$每个测试用例无需担心。 我们不能假设括号具有任何初始顺序，因此边缘情况包括以多个右括号开头或以多个左括号结尾的字符串，例如“)))(((”或“)()(”。

 一种简单的方法可能会尝试模拟移动每个括号并检查所得的字符串是否平衡。 这是浪费的，因为可能的移动数量会组合增长。 关键的见解是我们不需要模拟每个移动：最小移动次数由从左到右扫描时遇到的最大不平衡深度决定。 例如，右括号多于左括号的前缀表示缺陷，最终必须通过将括号移到前面来纠正。 

## 方法

 蛮力方法是尝试将每个括号移动到开头或结尾，递归生成所有序列，并检查每个序列是否平衡。 每张支票都是$O(n)$，并且可能序列的数量随阶乘增长$n$，即使对于$n=50$。 

最佳方法是在扫描字符串时跟踪前缀平衡。 定义一个运行总和，其中“(”将其增加 1，“)”将其减少 1。负余额意味着此时右括号多于左括号，这表明我们必须移到前面以避免出现负前缀的左括号的最小数量。 答案很简单，就是将这个运行总和的最大负值变成正值。 这是有效的，因为括号序列保证具有相同的计数，因此自动纠正最差的赤字可以保证字符串的其余部分可以平衡，而无需额外的移动。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 前缀平衡| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化变量`balance`为零。 这将在我们迭代时跟踪左括号和右括号之间的净差异。 
2. 初始化`max_deficit`为零。 这将记录遇到的最大负余额。 
3. 迭代字符串中的每个字符。 对于每个“(”，增量`balance`减 1。对于每个 ')'，递减`balance`1.
 4.更新后`balance`， 如果`balance`为负数，更新`max_deficit`是其当前值的最大值并且`-balance`。 这反映了我们迄今为止看到的最严重的前缀赤字。 
5. 扫描整个字符串后，`max_deficit`包含纠正所有负前缀所需的最小移动次数。 输出`max_deficit`。 

工作原理：前缀平衡准确捕获序列低于零的位置，这是唯一需要括号移动的情况。 每个负余额代表一个不匹配的结束括号，需要将相应的开始括号移到前面。 纠正最大负前缀可确保最终序列中没有无效前缀，从而保证结果序列是平衡的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    balance = 0
    max_deficit = 0
    for c in s:
        if c == '(':
            balance += 1
        else:
            balance -= 1
        if balance < 0:
            max_deficit = max(max_deficit, -balance)
    print(max_deficit)
```该解决方案使用快速 I/O 读取输入。 对于每个测试用例，我们维护一个正在运行的`balance`并在余额低于零时记录最大赤字。 这已经足够了，因为只有最大的赤字决定了必须将多少个左括号移到前面才能使所有前缀非负。 边缘条件（例如以多个右括号开头的字符串）会自动处理，因为`balance`立即变为负值，并且`max_deficit`已相应更新。 

## 工作示例

 输入的跟踪`)))(((()))`:

 | 字符| 平衡| 最大赤字 |
 | --- | --- | --- |
 | ')' | -1 | 1 |
 | ')' | -2 | 2 |
 | ')' | -3 | 3 |
 | '(' | -2 | 3 |
 | '(' | -1 | 3 |
 | '(' | 0 | 3 |
 | '(' | 1 | 3 |
 | ')' | 0 | 3 |
 | ')' | -1 | 3 |
 | ')' | -2 | 3 |

 最大赤字为 3，因此我们需要 3 步。 这与将前三个左括号移到前面完全对应。 

追踪`()()`:

 | 字符| 平衡| 最大赤字 |
 | --- | --- | --- |
 | '(' | 1 | 0 |
 | ')' | 0 | 0 |
 | '(' | 1 | 0 |
 | ')' | 0 | 0 |

 任何前缀都不会变为负数，因此需要零移动。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * t) | 每个测试用例扫描一次，n ≤ 50，t ≤ 2000 |
 | 空间| O(1) | O(1) | 每个测试用例仅维护几个整数变量|

 总的操作次数最多是50 * 2000 = 100,000，1秒之内轻松装下。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = input().strip()
        balance = 0
        max_deficit = 0
        for c in s:
            if c == '(':
                balance += 1
            else:
                balance -= 1
            if balance < 0:
                max_deficit = max(max_deficit, -balance)
        output.append(str(max_deficit))
    return "\n".join(output)

# provided samples
assert run("4\n2\n)(\n4\n()()\n8\n())()()(\n10\n)))((((())\n") == "1\n0\n1\n3", "sample 1"

# custom tests
assert run("1\n2\n()\n") == "0", "already balanced"
assert run("1\n6\n)))((("\n") == "3", "all closing then opening"
assert run("1\n6\n((()))\n") == "0", "already balanced nested"
assert run("1\n4\n)(()\n") == "1", "single move to correct prefix"
assert run("1\n10\n)()()()()(\n") == "1", "prefix deficit occurs only at first char"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2\n()\n | 2\n()\n | 0 | 最小的尺寸，已经平衡|
 | 6\n)))((\n | 3 | 全部关闭然后打开，最大赤字 |
 | 6\n((()))\n | 6 0 | 嵌套已经正确 |
 | 4\n)(()\n | 1 | 需要单步修复前缀 |
 | 10\n)()()()()(\n | 1 | 第一个字符仅导致赤字 |

 ## 边缘情况

 考虑输入`)))(((`。 从左到右扫描，余额为-1、-2、-3、-2、-1、0。最大负余额为-3，所以`max_deficit`变成 3. 将三个开口括号移到前面会产生`((()))`，这是完全平衡的。 The algorithm automatically handles strings that start with many closing brackets or have interleaved deficits without any special case handling. 类似地，一个已经平衡的字符串，如`()()`从不触发`balance < 0`，结果是正确的零步。
