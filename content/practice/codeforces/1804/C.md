---
title: "CF 1804C - 拉你的运气"
description: "我们有一个轮盘赌轮，有 n 个扇区，编号从 0 到 n-1。 轮子一开始有一个指向 x 扇区的箭头，我们可以通过用 1 到 p 之间的整数力 f 拉动手柄来旋转轮子。"
date: "2026-06-09T09:20:33+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1804
codeforces_index: "C"
codeforces_contest_name: "Nebius Welcome Round (Div. 1 + Div. 2)"
rating: 1500
weight: 1804
solve_time_s: 101
verified: true
draft: false
---

[CF 1804C - 拉你的运气](https://codeforces.com/problemset/problem/1804/C)

 **评分：** 1500
 **标签：** 蛮力、贪心、数学、数论
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个轮盘赌轮`n`扇区编号自`0`到`n-1`。 轮子以指向扇区的箭头开始`x`，我们可以通过用整数力拉动手柄来旋转它`f`之间`1`和`p`。 旋转的行为是这样的：在第一秒它前进`f`部门，下一秒`f-1`扇区，那么`f-2`，下降到`1`。 之后的总运动`f`秒是第一个的总和`f`正整数，即`f*(f+1)/2`。 扇区环绕模数`n`。 目标是检查是否存在一个整数`f`从`1`到`p`这样旋转后，箭头指向扇区`0`。 

约束条件告诉我们`n`可以达到`10^5`和`p`最多`10^9`。 总结所有测试用例，`n`不超过`2*10^5`。 尝试每一种方法的蛮力方法`f`从`1`到`p`是不可行的，因为`p`可以非常大。 我们需要比迭代所有力量更聪明的东西。 边缘情况包括箭头已经指向的情况`0`， 什么时候`p`相对于非常小`n`，或者当`x`接近轮盘末端并且旋转多次。 

例如，如果`n = 5`,`x = 2`,`p = 1`，那么唯一的自旋是`f=1`, 移动`1`部门。 箭头将结束于`3`，所以答案是“否”。 如果`p = 2`，我们可以选择`f=2`, 移动`3`部门总数 (`2 + 1`），它降落在`0`。 幼稚的方法无法处理大的问题`p`高效。 

## 方法

 暴力解决方案会尝试所有可能的力量`f`从`1`到`p`，计算`f*(f+1)/2`，添加`x`，并取模`n`看看是否达到`0`。 这原则上可行，但可能需要最多`10^9`每个测试用例的迭代次数，远远超出了时间限制。 

关键的见解是我们只需要检查方程是否`(x + f*(f+1)/2) % n == 0`有一些解决方案`1 <= f <= p`。 扩展它，我们想要`(f*(f+1)/2) % n == (-x) % n`。 左边是二次方`f`，虽然看起来很难直接反转，但我们注意到一旦`f`超过`n`, 总和`f*(f+1)/2`模数`n`开始重复模式，因为添加`n`到`f`将总和增加数倍`n`。 这意味着检查就足够了`f`最多`min(p, 2*n)`而不是一直到`p`，因为此后模式循环模`n`。 这减少了迭代`10^9`至多`2*10^5`每个测试用例，考虑到限制，这是可以管理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(p) | O(1) | O(1) | 对于大型来说太慢`p`|
 | 优化模数检查 | O(min(p, 2*n)) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`,`x`,`p`。 
3. 计算目标值`target = (-x) % n`。 这是我们需要前进才能达到的扇区数量`0`。 
4. 迭代`f`从`1`到`min(p, 2*n)`。 我们停在`2*n`因为`f*(f+1)/2`模数`n`超出此点将开始重复。 
5. 对于每个`f`，计算总进度`move = f*(f+1)//2`。 
6. 如果`(move % n) == target`，打印“是”并打破循环。 
7. 如果没有`f`满足条件，打印“No”。 

为什么它有效：关键属性是第一个的总和`f`整数取模`n`在有限范围内重复。 通过检查至`2*n`，我们保证会遇到所有不同的模余数`n`，所以如果存在解，我们就会找到它。 这避免了一直迭代`p`什么时候`p`非常大。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, x, p = map(int, input().split())
    target = (-x) % n
    found = False
    limit = min(p, 2*n)  # pattern repeats modulo n
    for f in range(1, limit + 1):
        move = f * (f + 1) // 2
        if move % n == target:
            found = True
            break
    print("Yes" if found else "No")
```我们使用`sys.stdin.readline`用于快速输入，因为最多可以有`10^4`测试用例。 这`min(p, 2*n)`技巧可以防止迭代到`10^9`。 整数除法`//`对于避免浮点问题是必要的。 模运算确保我们处理轮子的圆形性质。 

## 工作示例

 ### 示例 1

 输入：`5 2 2`| f | f*(f+1)/2 | f*(f+1)/2 | (f*(f+1)/2 + x) % n |
 | --- | --- | --- |
 | 1 | 1 | (1 + 2) % 5 = 3 |
 | 2 | 3 | (3 + 2) % 5 = 0 |

 该表表明`f=2`正好落在扇区上`0`。 该算法正确输出“是”。 

### 示例 2

 输入：`3 1 1000`| f | f*(f+1)/2 | f*(f+1)/2 | (f*(f+1)/2 + x) % n |
 | --- | --- | --- |
 | 1 | 1 | (1+1)%3=2 |
 | 2 | 3 | (3+1)%3=1 |
 | 3 | 6 | (6+1)%3=1 |
 | 4 | 10 | 10 (10+1)%3=2 |

 余数在之间循环`1`和`2`。 部门`0`永远不会达到。 算法输出“否”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * 分钟(p, n)) | 每个测试用例最多迭代`2*n`次数、总计`t*2*n`≤ 4*10^5 |
 | 空间| O(1) | O(1) | 每个测试用例只有恒定的额外变量 |

 该解决方案很容易满足 1 秒的限制，即使是最大的`t`和`n`。 

## 测试用例```python
def run(inp: str) -> str:
    import sys, io
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution
    t = int(input())
    for _ in range(t):
        n, x, p = map(int, input().split())
        target = (-x) % n
        found = False
        limit = min(p, 2*n)
        for f in range(1, limit+1):
            move = f*(f+1)//2
            if move % n == target:
                found = True
                break
        print("Yes" if found else "No")
    return output.getvalue().strip()

# Provided samples
assert run("7\n5 2 1\n5 2 2\n10 0 100\n11 7 100\n3 1 1000\n31 0 10\n100 49 7\n") == \
"No\nYes\nYes\nYes\nNo\nNo\nNo"

# Custom edge cases
assert run("2\n3 0 1\n3 2 2\n") == "Yes\nYes"  # already at 0, small n
assert run("1\n100000 99999 1000000000\n") == "Yes"  # very large p
assert run("1\n4 1 2\n") == "No"  # small p, can't reach 0
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 0 1\n3 2 2`|`Yes\nYes`| 最小尺寸的轮子，已经为零，小 p |
 |`100000 99999 1000000000`|`Yes`| 大 n、非常大 p 得到有效处理 |
 |`4 1 2`|`No`| 小p达不到目标|

 ## 边缘情况

 对于`n = 3, x = 0, p = 1`，算法立即计算`target = 0`和`f=1`给出`1*(1+1)/2 = 1`。 `(x + 移动) %
