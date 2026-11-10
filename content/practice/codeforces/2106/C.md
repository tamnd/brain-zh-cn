---
title: "CF 2106C - 樱桃炸弹"
description: "我们有两个长度为 $n$、$a$ 和 $b$ 的数组。 数组 $a$ 是完全已知的，并且 $b$ 有一些缺失的元素标记为 $-1$。 目标是填充 $b$ 中缺失的元素，使得 $ai + bi$ 之和对于所有 $i$ 都是恒定的。 $b$ 中的每个元素必须保留在 $[0, k]$ 内。"
date: "2026-06-08T04:52:01+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2106
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1020 (Div. 3)"
rating: 1000
weight: 2106
solve_time_s: 72
verified: true
draft: false
---

[CF 2106C - 樱桃炸弹](https://codeforces.com/problemset/problem/2106/C)

 **评分：** 1000
 **标签：** 贪婪、数学、排序
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个长度的数组$n$,$a$和$b$。 大批$a$是完全已知的，并且$b$有一些缺失的元素标记为$-1$。 目标是填补缺失的元素$b$使得总和$a_i + b_i$对所有人来说都是恒定的$i$。 中的每个元素$b$必须保持在$[0, k]$。 我们需要计算所有有效的方法来做到这一点。 

约束条件意味着$n$可以达到$2 \cdot 10^5$跨越所有测试用例，每个元素可以大到$10^9$。 迭代所有可能的缺失值的任何解决方案$b_i$会太慢，因为单个缺失元素可能会$k+1$选项，这是令人望而却步的。 因此，解决方案必须推理有效范围并避免暴力枚举。 

非明显的边缘情况包括某些情况$b_i$已经固定了。 如果两个固定$b_i$需要不同的常数$x$，没有有效的完成。 例如，$a = [2, 1]$,$b = [1, 0]$不能互补，因为$2 + 1 \neq 1 + 0$。 当需要时会出现另一种边缘情况$b_i$满足补码规则的值超过$k$或为负值。 必须仔细过滤这些场景。 

## 方法

 蛮力方法将为缺失的元素生成所有可能的替代品$b$并检查结果数组是否互补。 这是正确的，但太慢了。 认为$m$元素缺失，每个元素最多有$k+1$的可能性。 组合总数为$(k+1)^m$，当$k \approx 10^9$即使对于小$m$。 

关键的观察是互补对需要$x = a_i + b_i$对所有人都一样$i$。 对于以下位置：$b_i$已知，这修复了$x = a_i + b_i$。 如果这些固定立场不一致，则不存在任何解决方案。 对于失踪$b_i$，该值确定为$b_i = x - a_i$。 这立即给出了有效的检查：$0 \le b_i \le k$。 因此，我们将问题简化为找到允许的范围$x$从已知的$b_i$并计算有多少个选择满足对缺失选项的约束。 

具体来说，对于每个缺失元素，有效的$x$必须满足$a_i \le x \le a_i + k$。 组合数组中的所有约束给出有效的单个连续间隔$x$。 这个间隔的长度给出了答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((k+1)^m) | O((k+1)^m) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`x_min`作为 0 和`x_max`作为$k$加上最大的$a_i$在数组中。 这些将跟踪常数和的有效范围$x$。 
2. 迭代每个索引$i$的数组。 如果$b_i$不缺失，计算$x_i = a_i + b_i$。 更新`x_min`和`x_max`等于`x_i`因为一切都是固定的$b_i$执行相同的金额。 如果我们遇到之前固定的`x`这不同于`x_i`，立即返回 0，因为数组不能互补。 
3.如果$b_i$缺失，导出有效间隔$x$作为`[a_i, a_i + k]`自从$b_i = x - a_i$必须满足$0 \le b_i \le k$。 将此区间与当前区间相交`[x_min, x_max]`收紧可能的值$x$。 
4.处理完所有元素后，计算最终有效区间内整数值的个数`[x_min, x_max]`。 这是`max(0, x_max - x_min + 1)`并给出完成方法的总数$b$。 
5. 输出结果。 

不变的是每一步，`[x_min, x_max]`代表所有值$x$满足目前为止看到的固定元素和缺失元素。 交集保证无无效$x$滑过，所以任何$x$最后计数将生成一个有效的互补数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cherry_bomb():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        
        x_min = 0
        x_max = 2 * k  # upper bound for x
        
        fixed_x = None
        possible = True
        
        for ai, bi in zip(a, b):
            if bi != -1:
                current = ai + bi
                if fixed_x is None:
                    fixed_x = current
                    x_min = x_max = current
                elif current != fixed_x:
                    possible = False
                    break
            else:
                # missing element: b_i = x - a_i in [0, k] => x in [a_i, a_i + k]
                x_min = max(x_min, ai)
                x_max = min(x_max, ai + k)
        
        if not possible or x_min > x_max:
            print(0)
        else:
            print(x_max - x_min + 1)

cherry_bomb()
```该代码将固定元素和缺失元素的处理分开。 固定元素定义了严格的`x`，而缺失的元素将其限制在一个范围内。 使用`max`和`min`相交间隔可确保我们尊重所有约束。 最终的计数就是交集的大小。 

## 工作示例

 **示例1**

 输入数组：`a = [1, 3, 2]`,`b = [-1, -1, 1]`| 我| 一个[我] | b[i] | x_最小值| x_最大| 评论 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 1 | -1 | 1 | 11 | 11 缺失：[1, 1+10] | 中的 x
 | 1 | 3 | -1 | 3 | 11 | 11 缺失：[3, 3+10] 中的 x，与上一个 | 相交
 | 2 | 2 | 1 | 3 | 3 | 固定：x = 2+1 = 3，相交=> x_min = x_max = 3 |

 方式数量:`x_max - x_min + 1 = 1`**示例2**

 输入数组：`a = [0, 1, 0, 0, 1]`,`b = [-1, 0, 1, 0, -1]`| 我| 一个[我] | b[i] | x_最小值| x_最大| 评论 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | -1 | 0 | 1 | 缺失：[0, 0+1] | 中的 x
 | 1 | 1 | 0 | 1 | 1 | 固定：x = 1+0=1 |
 | 2 | 0 | 1 | 1 | 1 | 固定：x=0+1=1 |
 | 3 | 0 | 0 | 1 | 1 | 已修复：x=0+0=0 冲突 |

 检测到冲突，回答 0。 

这些痕迹证实该算法正确处理固定元素约束和缺失元素的间隔。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 一次线性遍历数组`a`和`b`计算间隔并检查一致性 |
 | 空间| O(n) | 存储输入数组； 无需额外的动态结构|

 鉴于总和$n$所有测试用例最多是$2 \cdot 10^5$，解决方案在 2 秒限制内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    cherry_bomb()
    return out.getvalue().strip()

# Provided samples
assert run("7\n3 10\n1 3 2\n-1 -1 1\n5 1\n0 1 0 0 1\n-1 0 1 0 -1\n5 1\n0 1 0 0 1\n-1 1 -1 1 -1\n5 10\n1 3 2 5 4\n-1 -1 -1 -1 -1\n5 4\n1 3 2 1 3\n1 -1 -1 1 -1\n5 4\n1 3 2 1 3\n2 -1 -1 2 0\n5 5\n5 0
```
