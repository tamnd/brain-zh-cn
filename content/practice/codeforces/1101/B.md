---
title: "CF 1101B - 手风琴"
description: "我们得到一个包含字母和一些特殊字符的字符串：[、]、: 和 约束告诉我们该字符串的长度最多为 500,000 个字符。"
date: "2026-06-12T05:37:37+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1101
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 58 (Rated for Div. 2)"
rating: 1300
weight: 1101
solve_time_s: 73
verified: true
draft: false
---

[CF 1101B - 手风琴](https://codeforces.com/problemset/problem/1101/B)

 **评分：** 1300
 **标签：** 贪心，实现
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个包含字母和一些特殊字符的字符串：`[`,`]`,`:`， 和`|`。 目标是提取该字符串的子序列，形成有效的“手风琴”，定义为左括号的模式`[`，后跟一个冒号`:`，然后零个或多个竖线`|`, 另一个冒号`:`，最后是右括号`]`。 子序列必须保持字符的顺序； 我们只能删除字符，不能重新排序或插入新字符。 我们被要求找到这样一个子序列的最大长度，或者`-1`如果不可能的话。 

约束告诉我们该字符串的长度最多可达 500,000 个字符。 这排除了任何检查所有可能子序列的算法，因为子序列的数量随着字符串长度呈指数增长。 线性或近线性解是合适的，但任何二次解都会太慢。 这一观察引导我们采用贪婪或两指针方法。 

非明显的边缘情况是由于括号和冒号必须出现在特定的相对位置这一事实而产生的。 例如，像这样的字符串`][:|:`具有所有必需的字符，但顺序错误，因此输出应该是`-1`。 另一种棘手的情况是括号后只有一个冒号的字符串：`[a:b]`。 在这里，该模式是有效的，我们必须认识到括号之间至少需要两个冒号。 没有竖线的字符串，例如`[::]`，有效并产生长度 4。 

## 方法

 蛮力方法将尝试生成以`[`, 结束于`]`，至少包含两个冒号，并计算它们之间的竖线。 原则上这是正确的，因为任何手风琴都必须是字符串的子序列。 然而，子序列的数量是`O(2^n)`，这对于`n`最多 500,000。 

关键的见解是我们需要的模式完全由四个位置决定：第一个`[`，最后一个`]`，之后的第一个冒号`[`，以及之前的最后一个冒号`]`。 一旦确定了这些职位，每个`|`可以包含在两个冒号之间。 这将问题简化为从左侧扫描字符串以查找最早的字符串`[`，那么最早的`:`之后，从右侧扫描查找最新的`]`，那么最新的`:`在它之前，并计算`|`两个冒号之间。 这是有效的，因为包括任何早期的`[`或稍后`]`会减少包含的条数，并且此最小括号冒号窗口之外的任何冒号都不能成为较长手风琴的一部分。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(1) | O(1) | 太慢了|
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化一个指针`left_bracket`从头开始遍历并找到第一个`[`。 如果不存在则返回`-1`。 
2. 继续扫描`left_bracket + 1`找到第一个冒号`:`。 如果不存在则返回`-1`。 
3. 初始化指针`right_bracket`从末尾遍历并找到最后一个`]`。 如果不存在则返回`-1`。 
4. 继续向后扫描`right_bracket - 1`找到最后一个冒号`:`在右括号之前。 如果不存在则返回`-1`。 
5. 如果第一个冒号的位置在最后一个冒号之后，则该模式不可能，因此返回`-1`。 
6. 统计全部`|`字符严格位于步骤 2 和 4 中标识的两个冒号之间。每个垂直条都会影响手风琴的长度。 
7. 手风琴的总长度为 4（对于`[`， 第一的`:`， 最后的`:`,`]`）加上数量`|`算了。 

保证正确性的不变量是最早的左括号和最晚的右括号，与最近的冒号相结合，形成竖线的最大可能窗口。 括号或冒号的任何其他选择都会缩短此窗口或违反所需的顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
n = len(s)

# Step 1: find first '['
try:
    left_bracket = s.index('[')
except ValueError:
    print(-1)
    sys.exit()

# Step 2: find first ':' after '['
try:
    first_colon = s.index(':', left_bracket + 1)
except ValueError:
    print(-1)
    sys.exit()

# Step 3: find last ']'
try:
    right_bracket = s.rindex(']')
except ValueError:
    print(-1)
    sys.exit()

# Step 4: find last ':' before ']'
try:
    last_colon = s.rindex(':', 0, right_bracket)
except ValueError:
    print(-1)
    sys.exit()

# Step 5: check if window is valid
if first_colon >= last_colon:
    print(-1)
    sys.exit()

# Step 6: count '|' between the colons
count_pipes = s[first_colon+1:last_colon].count('|')

# Step 7: compute total length
total_length = 4 + count_pipes
print(total_length)
```该解决方案首先确保最小的必要结构（`[::]`) 通过找到外括号和冒号。 使用Python的`index`和`rindex`使我们能够在线性时间内有效地定位这些字符。 计数`|`两个冒号之间是一个简单的切片并且`count`运算，4的加法占竖线外固定的4个字符。 明确处理边界条件，例如没有冒号或冒号顺序错误。 

## 工作示例

 ### 示例 1

 输入：`|[a:b:|]`| 步骤| 变量| 价值|
 | --- | --- | --- |
 | 寻找`[`|`left_bracket`| 1 |
 | 先找到`:`|`first_colon`| 3 |
 | 寻找`]`|`right_bracket`| 7 |
 | 查找最后一个`:`|`last_colon`| 5 |
 | 数数` | `| 冒号之间 |
 | 总长度| | 4 + 1 = 5 |

 输出：5

 ### 自定义示例

 输入：`abc[:||:]def`| 步骤| 变量| 价值|
 | --- | --- | --- |
 | 寻找`[`|`left_bracket`| 3 |
 | 先找到`:`|`first_colon`| 4 |
 | 寻找`]`|`right_bracket`| 8 |
 | 查找最后一个`:`|`last_colon`| 7 |
 | 数数` | `| 冒号之间 |
 | 总长度| | 4 + 2 = 6 |

 输出：6

 跟踪显示该算法正确找到了最小有效窗口并计算了冒号之间的所有条形。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每次搜索（`index`,`rindex`) 并且切片计数与字符串长度呈线性 |
 | 空间| O(1) | O(1) | 除了整数索引和计数器之外，没有使用额外的数组 |

 该方案以线性时间处理字符串，适合在3秒的时间限制下处理最多50万个字符的字符串。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open('accordion_solution.py').read(), globals())
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("|[a:b:|]") == "5", "sample 1"

# Minimum valid accordion
assert run("[::]") == "4", "minimum accordion"

# No brackets
assert run("::||:") == "-1", "no brackets"

# Colons in wrong order
assert run("[:a]b:c") == "-1", "colons invalid order"

# Multiple pipes
assert run("x[y:|||:z]w") == "7", "three pipes"

# Maximum-size input with valid accordion
assert run("[" + ":"*250000 + "|"*100000 + ":" + "]") == str(4 + 100000), "max size valid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[::]`| 4 | 最小有效手风琴|
 |`:: |  | :`|
 |`[:a]b:c`| -1 | 冒号顺序错误 |
 | `x[y: | | |
 |`[:`*250000 + " | "*100000 + ":]" | 100004 |

 ## 边缘情况

 只有一个括号的字符串，例如`[abc`，导致第一次搜索成功，但第二次冒号搜索失败，正确返回`-1`。 例如，第一个冒号位于最后一个冒号之后的字符串`[a:b:c]`由于未对齐，第一个冒号位于位置 2，最后一个冒号位于位置 1，也可以正确处理，返回`-1`。 竖线为零的字符串，例如`[::]`，被接受并返回长度 4。因此该算法处理所有排序和存在
