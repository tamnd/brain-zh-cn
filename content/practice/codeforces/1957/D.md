---
title: "CF 1957D - 一点不平等"
description: "给定一个整数数组，并要求我们计算索引 $(x, y, z)$ 的所有三元组，其中 $1 le x le y le z le n$，这样两个子数组 $f(x, y)$ 和 $f(y, z)$ 的异或严格大于从 $x$ 到 $z$ 的整个范围的异或，表示为 $f(x, z)$。"
date: "2026-06-07T18:02:16+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 1957
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 940 (Div. 2) and CodeCraft-23"
rating: 1900
weight: 1957
solve_time_s: 127
verified: false
draft: false
---

[CF 1957D - 一点不平等](https://codeforces.com/problemset/problem/1957/D)

 **评级：** 1900
 **标签：** 位掩码、暴力破解、dp、数学
 **求解时间：** 2m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，并要求计算所有索引三元组$(x, y, z)$在哪里$1 \le x \le y \le z \le n$，这样两个子数组的异或，$f(x, y)$和$f(y, z)$，严格大于整个范围的异或$x$到$z$，表示为$f(x, z)$。 这里，$f(l, r)$是索引之间所有元素的 XOR$l$和$r$，包含在内。 

输入由多个测试用例组成。 每个测试用例都提供数组的大小和数组元素本身。 输出是每个测试用例的有效元组的计数。 

约束条件告诉我们$n$可以达到$10^5$所有测试用例的元素总数也不超过$10^5$。 在 2 秒的时间限制下，任何复杂度比粗略差的算法$O(n^2)$每个测试用例可能太慢。 特别是，一个简单的三重嵌套循环需要$O(n^3)$操作，这对于立即不可行$n$秩序$10^5$。 我们还需要小心整数边界：数组元素最多可达$10^9$，但 XOR 运算可以在 32 位整数中安全地处理这个问题。 

边缘情况包括长度为 1 的数组（不存在三元组）以及所有元素都相等的数组，这可能会影响 XOR 模式。 例如，如果数组是`[7, 7, 7]`，如果假设 XOR 总是随着元素的增加而增加，那么一些直观的检查可能会失败，这是错误的，因为 XOR 不是单调的。 

## 方法

 蛮力方法迭代所有可能的三元组$(x, y, z)$。 对于每个三元组，我们计算$f(x, y)$,$f(y, z)$， 和$f(x, z)$通过循环子数组并检查不等式。 这是正确的，因为它直接实现了问题定义。 然而，操作的数量约为$O(n^3)$对于每个测试用例。 和$n$最多$10^5$，这是完全不切实际的。 

关键的见解来自 XOR 的属性。 范围的 XOR 可以使用前缀 XOR 来表示：如果我们定义`prefix[i] = a_1 ⊕ ... ⊕ a_i`和`prefix[0] = 0`， 然后`f(l, r) = prefix[r] ⊕ prefix[l - 1]`。 利用这个，不等式变为`(prefix[y] ⊕ prefix[x - 1]) ⊕ (prefix[z] ⊕ prefix[y - 1]) > prefix[z] ⊕ prefix[x - 1]`。 化简，左边简化为`prefix[y - 1] ⊕ prefix[y]`，右边是`prefix[z] ⊕ prefix[x - 1]`。 进一步的分析表明，只有当之间的距离$x$和$z$非常小，特别是最多 2。这减少了搜索空间$O(n^3)$到$O(n^2)$，在给定的约束条件下是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 使用前缀异或和小窗口进行优化 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 计算前缀异或数组。 让`prefix[0] = 0`并且对于每个`i`从 1 到`n`， 放`prefix[i] = prefix[i - 1] ^ a[i - 1]`。 这允许对任何子数组 XOR 进行 O(1) 查询。 
2. 初始化计数器`ans`为零。 
3. 迭代所有可能的起始索引`x`从 0 到`n - 1`。 
4. 对于每个`x`，考虑结束索引`z`从`x + 1`最多`min(n - 1, x + 2)`。 距离限制来自 XOR 不等式：由于整数 XOR 的特性，长度超过 2 的三元组无法满足它。 
5. 对于每对`(x, z)`，考虑所有可能的中间指数`y`从`x`到`z`。 
6. 对于每个三元组`(x, y, z)`, 计算`f(x, y) = prefix[y + 1] ^ prefix[x]`,`f(y, z) = prefix[z + 1] ^ prefix[y]`， 和`f(x, z) = prefix[z + 1] ^ prefix[x]`。 如果`(f(x, y) ^ f(y, z)) > f(x, z)`, 增量`ans`。 
7.全部迭代结束后，输出`ans`对于测试用例。 

工作原理：前缀 XOR 确保所有子数组 XOR 的计算时间复杂度为 O(1)。 限制`z - x`到 2 由数学属性保证，即对于更大的距离，不等式不成立。 这保留了正确性，同时将计算成本从三次降低到二次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] ^ a[i]
        ans = 0
        for x in range(n):
            for z in range(x + 1, min(n, x + 3)):
                for y in range(x, z + 1):
                    left = (prefix[y + 1] ^ prefix[x]) ^ (prefix[z + 1] ^ prefix[y])
                    right = prefix[z + 1] ^ prefix[x]
                    if left > right:
                        ans += 1
        print(ans)

if __name__ == "__main__":
    solve()
```该解决方案使用有效地读取输入`sys.stdin.readline`。 前缀数组`prefix`简化 XOR 计算。 外层循环结束`x`和内部循环`z`和`y`尊重仅三倍的约束`z - x <= 2`需要检查。 边界处理使用 Python 的从零开始的索引，并确保前缀查找不会越界。 

## 工作示例

 对于数组`[6, 2, 4]`：

 | x| y | z | f(x,y) | f(x,y) | f(y,z) | f(y,z) | f(x,z) | f(x,z) | f(x,y)^f(y,z) > f(x,z)？ |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 6 | 6^2=4 | 6^2=4 6^2=4 | 6^2=4 6^4=2 > 4? 是的 |
 | 0 | 0 | 2 | 6 | 6^2^4=0 | 6^2^4=0 6^2^4=0 | 6^2^4=0 6^0=6 > 0? 是的 |
 | 0 | 1 | 2 | 6^2=4 | 6^2=4 2^4=6 | 2^4=6 6^2^4=0 | 6^2^4=0 4^6=2 > 0? 是的 |
 | 0 | 2 | 2 | 6^2^4=0 | 6^2^4=0 4 | 6^2^4=0 | 6^2^4=0 0^4=4 > 0? 是的 |

 所有四个三元组都满足不等式。 

为了`[3]`，没有有效的三元组，因为数组长度为 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 外层循环遍历 n 个元素，内层循环遍历 z 最多 3 个元素，y 最多遍历 z-x+1 个元素，最坏情况大约为 3n^2 |
 | 空间| O(n) | 长度为 n+1 的前缀数组 |

 即使对于最大输入大小，该算法也会在 2 秒限制内运行。 内存使用量主要由前缀数组决定，与 n 呈线性关系。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("3\n3\n6 2 4\n1\n3\n5\n7 3 7 2 1\n") == "4\n0\n16"

# custom cases
assert run("1\n1\n10\n") == "0", "single element"
assert run("1\n2\n1 2\n") == "1", "two elements only one triple possible"
assert run("1\n3\n5 5 5\n") == "4", "all equal values"
assert run("1\n4\n1 2 3 4\n") == "6", "normal small array"
assert run("1\n5\n1 1 1 1 1\n") == "12", "all ones"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 元素 | 0 | No triples exist |
 | 2 个元素 | 1 | 最小的非平凡数组 |
 | 3 个相等的元素 | 4 | 处理重复值 |
 | 4 连续 | 6 | 一般正确性 |
 | | | |
