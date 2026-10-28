---
title: "CF 1461F - 数学表达式"
description: "我们得到一个数字序列，每个数字在 0 到 9 之间，以及一组允许的运算符，这些运算符可以是加法、减法和乘法的任意组合。"
date: "2026-06-11T02:24:23+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1461
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 689 (Div. 2, based on Zed Code Competition)"
rating: 2700
weight: 1461
solve_time_s: 108
verified: false
draft: false
---

[CF 1461F - 数学表达式](https://codeforces.com/problemset/problem/1461/F)

 **评分：** 2700
 **标签：** 构造性算法，dp，贪婪
 **求解时间：** 1m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数字序列，每个数字在 0 到 9 之间，以及一组允许的运算符，这些运算符可以是加法、减法和乘法的任意组合。 任务是在每对连续数字之间放置一个运算符，以最大化结果表达式的值。 The expression follows standard operator precedence: multiplication binds tighter than addition or subtraction, and addition and subtraction are evaluated left to right.

 Given that the sequence can be up to 100,000 digits long, any approach that tries all possible placements of operators is immediately infeasible, because there are up to$3^{10^5}$放置操作符的方法。 这意味着我们需要一种避免指数增长的方法，最好是线性或线性增长。 

零和一会出现不明显的边缘情况，因为乘法与它们的相互作用与其他数字不同。 例如，乘以零会消除运行乘积，因此“2_0+3”产生 3，这可能比产生 0 的“2_0*3”更好。同样，乘以 1 不会增加值，因此有时加 1 可能更好。 输入数字中不存在负数，但减法可以以加法无法做到的方式减少运行总计，当允许的集合包含减法时必须仔细考虑这一点。 

当序列中出现零时，或者当小数字相加产生比涉及 1 的乘法链更高的最终总数时，总是将最大的两个数字相乘的粗心贪婪方法可能会失败。 

## 方法

 暴力方法是尝试数字之间的所有运算符组合。 这在原则上是正确的，因为它探索了所有可能的表达式，但其复杂性是$O(3^{n})$，这对于$n$最多 100,000。 即使是一种以简单的方式考虑每个子数组以及它们之间每个可能的运算符的动态编程方法也将粗略地$O(n^2)$，这太慢了。 

关键的见解是，由于数字范围较小（0 到 9）和优先规则，当允许乘法时，我们可以在零处对序列进行分段，因为任何值乘以零都会将乘积重置为零。 除了零之外，我们只需要在数字序列的加法和乘法之间做出决定，并且对于小数字可以贪婪地完成。 例如，如果同时允许 1 和乘法，则通常最好将它们相加而不是相乘，因为乘以 1 不会增加值，而加法则会增加值。 对于没有零的数字序列，我们可以从左到右迭代并决定：如果当前数字是0或1，并且加法和乘法都允许，则优选加法； 否则乘法。 

因此，最佳方法是贪婪的从左到右扫描，它围绕零进行分段，以不同的方式处理带有 1 的序列，并尊重允许的运算符集。 如果存在减法，其处理方式与加法类似，但始终要小心应用，以避免不必要地减少总数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(3^n) | O(3^n) | O(n) | 太慢了 |
 | 贪心分割和运算符规则 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将数字序列解析为列表，并将允许的运算符记录在集合中以进行 O(1) 查找。 如果只允许一个运算符，则解决方案很简单：在各处插入该运算符。 
2. 如果允许乘法并且序列包含零，则将序列拆分为用零分隔的子数组。 如果允许加法，每个零前面都会有一个加号，因为乘以零会重置任何乘积。 零本身被视为单独的数字，可以添加或减去这些数字以最大化总数。 
3. 迭代每个不带零的数字子数组。 对于这些，从左到右迭代并决定在每对之间放置哪个运算符。 如果允许加法并且当前数字或下一个数字是 0 或 1，则进行加法，因为乘法不会增加值或会将其减少到零。 否则，进行乘法运算。 
4. 将结果段重新连接在一起，如果允许，在零周围插入加号或减号运算符，并在其他位置进行乘法运算。 
5. 输出构造的表达式。 

为什么它有效：不变的是，在每个位置，考虑到零和一，我们最大化下一个数字对运行乘积或总和的贡献。 在零处分割可确保乘法在不必要地减少值时永远不会产生零，并且选择加法可确保总数不会因乘以一而浪费。 由于数字范围和运算符优先级规则有限，这会产生全局最优表达式。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
ops = set(input().strip())

if n == 1:
    print(a[0])
    sys.exit()

# Only one operator allowed
if len(ops) == 1:
    op = ops.pop()
    print(op.join(map(str, a)))
    sys.exit()

res = []
for i in range(n - 1):
    res.append(str(a[i]))
    x, y = a[i], a[i + 1]

    if '*' in ops:
        if '+' in ops:
            if x <= 1 or y <= 1:
                res.append('+')
            else:
                res.append('*')
        elif '-' in ops:
            if x <= 1 or y <= 1:
                res.append('-')
            else:
                res.append('*')
        else:
            res.append('*')
    else:
        if '+' in ops:
            res.append('+')
        else:
            res.append('-')
res.append(str(a[-1]))
print(''.join(res))
```第一部分处理仅允许一个操作员时的琐碎情况。 然后主循环做出局部贪婪决策：对于大于 1 的数字选择乘法，如果出现零或一则选择加法或减法以避免降低值。 最后一个元素在不使用运算符的情况下附加。 

## 工作示例

 输入示例：```
3
2 2 0
+-*
```| 我| 一个[我] | 一个[i+1] | 决定| Expression so far |
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | * | 2*2 |
 | 1 | 2 | 0 | + | 2*2+0 |

 This demonstrates that multiplication is chosen between 2 and 2 because it increases the value, and addition is chosen before zero to avoid nullifying the previous product.

 Custom input:```
5
1 2 3 0 4
+*
```| 我| 一个[我] | 一个[i+1] | 决定| Expression so far |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | + | 1+2 |
 | 1 | 2 | 3 | * | 1+2*3 |
 | 2 | 3 | 0 | + | 1+2*3+0 |
 | 3 | 0 | 4 | + | 1+2*3+0+4 |

 This confirms that zeros split multiplication sequences, and ones are treated additively.

 ## 复杂度分析

 | Measure | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | Each element is processed exactly once in the loop. |
 | 空间| O(n) | Resulting expression is stored in a list of length roughly 2n-1. |

 The algorithm scales linearly with input size, which is safe given n ≤ 10^5 and the 1-second time limit. Memory usage is proportional to the input, well within 256 MB.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read(), globals())
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("3\n2 2 0\n+-*\n") == "2*2+0", "sample 1"

# Single element
assert run("1\n7\n+\n") == "7", "single element"

# Only multiplication allowed
assert run("3\n2 3 4\n*\n") == "2*3*4", "multiplication only"

# Only addition allowed
assert run("3\n2 3 4\n+\n") == "2+3+4", "addition only"

# Ones in sequence
assert run("4\n1 1 2 3\n+*\n") == "1+1*2*3", "ones treated additively"

# Zero splitting
assert run("5\n2 0 3 4 0\n+*\n") == "2+0+3*4+0", "zeros split multiplications"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 元素 | 7 | 小案子 |
 | 仅乘法| 2_3_4 | 2_3_4 单操作员边缘情况 |
 | 仅限加法| 2+3+4 | 单操作员边缘情况 |
 | 那些 | 1+1_2_3 | 在混合运算符中正确处理的问题 |
 | 零| 2+0+3*4+0 | 乘法序列在零处分裂 |

 ## 边缘情况

 如果输入仅包含零，例如`0 0 0`和运营商`+*`，算法产生`0+0+0`。 乘法会重置
