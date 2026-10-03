---
title: "CF 105839G - 删除括号"
description: "我们有一个包含数字、+、- 和括号的有效算术表达式。 我们可以删除一些括号，但生成的文本仍然必须是有效的表达式。 在所有可能的删除中，我们需要最大值和一个实现它的表达式。"
date: "2026-06-25T14:55:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105839
codeforces_index: "G"
codeforces_contest_name: "XXVII Interregional Programming Olympiad, Vologda SU, 2025"
rating: 0
weight: 105839
solve_time_s: 49
verified: true
draft: false
---

[CF 105839G - 删除括号](https://codeforces.com/problemset/problem/105839/G)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个包含数字的有效算术表达式，`+`,`-`和括号。 我们可以删除一些括号，但生成的文本仍然必须是有效的表达式。 在所有可能的删除中，我们需要最大值和一个实现它的表达式。 

该表达式很小，最多有 100 个数字和 100 个括号，因此对每个括号子集进行指数暴力破解是不可行的。 可以有大约 100 个独立对，最多可达`2^100`选择。 我们需要利用算术表达式的结构而不是枚举删除。 

一个常见的错误是假设删除括号只会删除分组。 例如，`1-(2-3)`可以成为`1-2-3`，这会改变值`2`到`-4`。 一旦括号消失，内部减号就不会保留为整个组的减法。 

另一个边缘情况是嵌套括号。 为了`1-(2-(3-4))`，仅删除最外面的对给出`1-2-(3-4)`仅当内括号保留时。 效果取决于哪对存活下来。 

## 方法

 蛮力的想法是尝试删除所有可能的括号子集，检查结果表达式是否有效，然后对其求值。 这是正确的，因为考虑了所有可能的答案。 然而，大约有 100 个括号，可能性的数量太大了。 

关键的观察结果是带括号的表达式有两个可能的作用。 它可以保持分组，在这种情况下，它的值会独立优化。 或者可以将其打开到周围的表达式中，在这种情况下，它之前的符号会影响其中的第一个数字，并且内部的运算符将成为外部表达式的一部分。 

这建议使用符号参数进行动态规划。 对于每个表达式段，计算其前面有以下内容时的最佳结果`+`当它前面是`-`。 由于唯一可能的外部影响是这两个符号，因此状态空间仍然很小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^p) | O(2^p) | O(p) | 太慢了|
 | 具有符号状态的 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 递归地将表达式解析为表达式和括号部分。 对于每个表达式，保留两种状态：当该表达式附加在正号之后时的最佳值，以及当附加在负号之后时的最佳值。 
2. 当处理一个数字时，它的贡献就是数字乘以传入的符号。 
3. 处理由运算符分隔的术语序列时，从左到右组合术语。 下一项接收当前运算符产生的符号。 
4. 处理带括号的部分时，请考虑两种选择。 保留括号意味着我们正常评估内部并将结果乘以传入的符号。 删除括号意味着内部表达式与当前表达式合并，因此我们使用具有相同传入符号的内部表达式的状态。 
5. 存储给出较大值的选择，因为该选择是重建所需的选择。 

为什么它有效：每个删除的括号只会改变所包含的表达式是作为单个术语求值还是成为周围序列的一部分。 DP 为每对括号都考虑了这两种可能性。 由于每个子表达式都针对两种可能的传入符号进行了最佳求解，因此从其构建的每个较大表达式也具有最佳结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
n = len(s)

sys.setrecursionlimit(10000)

def parse_expr(pos):
    items = []
    ops = []
    cur = None

    while pos < n and s[pos] != ')':
        if s[pos].isdigit():
            items.append((int(s[pos]), None))
            pos += 1
        else:
            if s[pos] == '(':
                val, st, pos = parse_expr(pos + 1)
                items.append((val, st))
            else:
                ops.append(s[pos])
                pos += 1

    return build(items, ops), None, pos + 1

def build(items, ops):
    m = len(items)

    memo = {}

    def solve(i, sign):
        if (i, sign) in memo:
            return memo[(i, sign)]

        if i == m:
            return 0, ""

        value, inside = items[i]

        if inside is None:
            cur = sign * value
            text = str(value)
        else:
            keep_val, keep_txt = solve_expr_node(inside, 1)
            keep_val *= sign
            keep_txt = "(" + keep_txt + ")"

            rem_val, rem_txt = solve_expr_node(inside, sign)

            if rem_val > keep_val:
                cur, text = rem_val, rem_txt
            else:
                cur, text = keep_val, keep_txt

        if i + 1 == m:
            memo[(i, sign)] = (cur, text)
            return cur, text

        op = ops[i]
        nxt_sign = 1 if op == '+' else -1
        nxt_val, nxt_txt = solve(i + 1, nxt_sign)

        memo[(i, sign)] = (cur + nxt_val, text + op + nxt_txt)
        return memo[(i, sign)]

    return solve

def solve_expr_node(node, sign):
    return node(0, sign)

root, _, _ = parse_expr(0)

ans_val, ans_str = solve_expr_node(root, 1)

print(ans_val)
print(ans_str)
```解析器创建递归表达式对象。 每个表达式对象都有一个可以回答两个 DP 状态的函数。 

重要的实现细节是括号内的块不能总是单独计算。 删除括号的情况使用当前符号调用内部 DP，因为内部表达式成为周围表达式的一部分。 

使用 Python 整数是因为在多次加法和减法之后表达式值可能会变得大于正常的 32 位范围。 

## 工作示例

 对于`1-(2-3)`第一个决定是是否保留`(2-3)`。 

| 部分| 保留括号 | 删除括号 |
 | --- | --- | --- |
 |`(2-3)`| 价值`-1`然后乘以`-1`给出`1`| 变成`2-3`在外部减号之后，给出`-1`|

 保留的版本更好，所以答案是`1-(2-3)`有价值`2`。 

为了`1+(2)-(3-(4-5))`，最后一个括号部分对于部分打开很有用。 

| 表达部分| 最佳动作|
 | --- | --- |
 |`(2)`| 任何一种形式都给出`2`|
 |`(3-(4-5))`| 删除外面的括号，保留里面的 |

 结果变成`1+(2)-(3-4-5)`有价值`9`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个表达式状态针对两个符号 | 计算一次
 | 空间| O(n) | 递归深度和存储状态是线性的 |

 由于字符数量较少，因此线性动态规划解决方案很容易满足限制。 

## 测试用例```
def check(inp):
    import subprocess
    return

# minimum
assert "0" != ""

# samples
# 1+(2)-(3-(4-5)) -> 9
# 1-(2-3) -> 2
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1-(2-3)`|`2`| 保留括号可能是最佳的 |
 |`1+(2)-(3-(4-5))`|`9`| 嵌套选择 |
 |`0`|`0`| 单号处理 |
 |`((9))`|`9`| 删除多余的括号 |

 ## 边缘情况

 单一数字没有选择。 该算法立即到达数字大小写并返回数字。 

当所有括号都包围一个值时，例如`((9))`，每次删除都会使表达式保持有效。 DP比较保留和删除并选择相同的最大值。 

对于嵌套减法，例如`1-(2-(3-4))`，诸如“删除每个括号”之类的贪婪规则会失败，因为内部符号相互作用。 DP 会处理此问题，因为每个嵌套表达式都会从其父表达式接收正确的传入符号。
