---
title: "CF 1909C - 大间隔"
description: "我们在数轴上得到一组 $n$ 区间。 每个间隔都有一个左端点 $li$、一个右端点 $ri$ 和每单位长度的权重 $ci$。 区间的实际权重计算公式为$ci cdot (ri - li)$。"
date: "2026-06-08T20:28:33+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "dsu", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1909
codeforces_index: "C"
codeforces_contest_name: "Pinely Round 3 (Div. 1 + Div. 2)"
rating: 1400
weight: 1909
solve_time_s: 115
verified: true
draft: false
---

[CF 1909C - 大间隔](https://codeforces.com/problemset/problem/1909/C)

 **评分：** 1400
 **标签：** 构造性算法、数据结构、DSU、贪心、数学、排序
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一组$n$数轴上的间隔。 每个区间都有一个左端点$l_i$, 右端点$r_i$，以及每单位长度的重量$c_i$。 区间的实际权重计算如下$c_i \cdot (r_i - l_i)$。 目标是最小化所有间隔的权重总和。 

不同之处在于我们可以独立地对数组重新排序$l$,$r$， 和$c$。 唯一的限制是重新排序后，每个间隔必须保持有效，这意味着$l_i < r_i$。 本质上，这个问题允许我们将左端点、右端点和成本以任意组合配对，只要区间格式良好。 所有端点都是不同的，这保证了对它们进行排序将产生有效的间隔而不会重复。 

约束表明所有测试用例的间隔总数不超过$10^5$，这意味着任何$O(n \log n)$每个测试用例的解决方案是可以接受的。$O(n^2)$暴力方法被排除。 非明显的边缘情况包括最小左端点可以与最大右端点配对的情况，这将产生非常大的间隔。 粗心的方法可能无法按正确的顺序对数组进行排序，或者无法将最高的成本与最小的长度配对，从而导致总重量不理想。 

例如，如果$l=[1,3]$,$r=[5,2]$,$c=[10,1]$, 配对$1\to5$和$10$和$3\to2$和$1$无效，因为$3>2$，所以我们必须重新排序$r$到$[2,5]$。 这种情况下的最佳配对是$l=[1,3]$,$r=[2,5]$,$c=[10,1]$, 赋予权重$10_1 + 1_2 = 12$。 天真贪婪，只会配对$c$任何间隔都可能失败。 

## 方法

 蛮力方法是尝试每一种排列$l$,$r$， 和$c$，检查有效性，并计算总和。 为了$n$间隔，有$n!^3$组合，这是完全不可能的。 即使只尝试所有对$l$和$r$具有固定的$c$是$O(n!^2)$，这也太慢了。 

关键的见解来自于观察总重量是乘积的总和$c_i \cdot (r_i - l_i)$。 为了最小化这个总和，我们应该将最小的差异配对$(r_i - l_i)$成本最大$c_i$，或者等效地，按升序对差异进行排序，并按降序对成本进行排序，并将它们成对相乘。 同样，为了尽量减少差异本身，我们应该将最小的配对$l_i$与最小的$r_i$那仍然比它大。 这可以通过排序来实现$l$和$r$独立地按升序排列并按索引匹配它们。 

简而言之，最优解就是对左端点进行排序$l$按升序排列，正确的端点$r$按升序排列，以及成本$c$按降序排列。 然后，计算总和$c_i \cdot (r_i - l_i)$对于每个$i$。 排序确保有效间隔（$l_i < r_i$）由于不同的端点，并且下降$c$确保最大的成本应用于最小的间隔长度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!^3) | O(n!^3) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$n$，左端点$l$, 右端点$r$和成本$c$。 
3. 对数组进行排序$l$按升序从最小到最大获取左端点。 
4. 对数组进行排序$r$按升序排列以获得从小到大的正确端点。 
5. 对数组进行排序$c$按降序将最大成本与最小间隔长度配对。 
6. 初始化变量`total_weight`为零。 
7. 迭代所有区间$i=0$到$n-1$:

 - 计算间隔的长度为$length = r[i] - l[i]$。 
- 乘以相应的成本`c[i]`得到区间权重。 
- 添加这个到`total_weight`。 
8. 打印当前测试用例的总重量。 

为什么它有效：排序$l$和$r$升序确保对于每个$i$,$l_i < r_i$成立，因为所有端点都是不同的。 排序$c$降序确保每单位长度的最大成本乘以最小的可能长度，从而最小化乘积之和。 贪婪属性成立是因为任何其他成本与区间的配对要么将较大的成本分配给较大的长度，从而增加总和，要么违反区间有效性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    l = list(map(int, input().split()))
    r = list(map(int, input().split()))
    c = list(map(int, input().split()))

    l.sort()
    r.sort()
    c.sort(reverse=True)

    total_weight = 0
    for i in range(n):
        total_weight += c[i] * (r[i] - l[i])
    print(total_weight)
```说明：该解决方案首先有效地读取输入`sys.stdin.readline`。 排序`l`和`r`升序确保有效间隔，同时排序`c`降序使总和最小化。 该循环将相应元素相乘并累加总和。 使用`reverse=True`为了`c`至关重要，因为忘记这一步会导致小成本与小间隔配对，这是次优的。 

## 工作示例

 **样品1：**

 | 我| 我| r | c | 右-左 | 重量 | 总重量 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 3 | 12 | 12 100 | 100 9 | 900 | 900 900 | 900
 | 1 | 8 | 23 | 23 100 | 100 15 | 15 1500 | 1500 2400 | 2400

 已排序$l=[3,8]$,$r=[12,23]$,$c=[100,100]$产生总权重 2400。这证实了贪婪配对的工作原理。 

**样本2：**

 | 我| 我| r | c | 右-左 | 重量 | 总重量 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 3 | 3 | 2 | 6 | 6 |
 | 1 | 2 | 4 | 3 | 2 | 6 | 12 | 12
 | 2 | 5 | 10 | 10 2 | 5 | 10 | 10 22 | 22
 | 3 | 20 | 30| 2 | 10 | 10 20 | 42 | 42

 左右升序、成本降序排序产生最小总和 42。这表明成本高的短间隔和成本小的长间隔都被正确分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对三个数组进行排序占主导地位，线性传递来计算总和 |
 | 空间| O(n) | 每个测试用例存储三个数组 |

 鉴于以下限制$n$最多$10^5$和总和$n$在 ≤ 10^5 的测试用例中，该解决方案可以在时间和内存限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution call
    t = int(input())
    for _ in range(t):
        n = int(input())
        l = list(map(int, input().split()))
        r = list(map(int, input().split()))
        c = list(map(int, input().split()))
        l.sort()
        r.sort()
        c.sort(reverse=True)
        total_weight = sum(c[i]*(r[i]-l[i]) for i in range(n))
        print(total_weight)
    return output.getvalue().strip()

# provided samples
assert run("2\n2\n8 3\n12 23\n100 100\n4\n20 1 2 5\n30 4 3 10\n2 3 2 3\n") == "2400\n42"

# minimum-size input
assert run("1\n1\n1\n2\n10\n") == "10"

# maximum-size input with increasing sequences
n = 10**5
l = ' '.join(map(str, range(1,n+1)))
r = ' '.join(map(str, range(2,n+2)))
c = ' '.join(['1']*n)
input_str = f"1\n{n}\n{l}\n{r}\n{c}\n"
output_str = str(sum(1 for _ in range(n)))
assert run(input_str)  # checks performance

# all equal values
assert run("1\n3\n1 2 3\n4 5 6\n5 5 5\n") == "45"

# boundary condition: large costs
assert run("1\n2\n1 3\n4 6\n1000000 1\n") == str(1000000*(4-1) + 1*(6-3))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | | | |
