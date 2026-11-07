---
title: "CF 1933C - 海龟手指：计算 k 的值"
description: "我们被要求计算不同值 $k$ 的数量，以便我们可以将给定数字 $l$ 表示为 $l = k cdot a^x cdot b^y$（对于非负整数 $x$ 和 $y$）。"
date: "2026-06-08T18:13:34+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1933
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 929 (Div. 3)"
rating: 1100
weight: 1933
solve_time_s: 101
verified: true
draft: false
---

[CF 1933C - 海龟手指：计算 k 的值](https://codeforces.com/problemset/problem/1933/C)

 **评分：** 1100
 **标签：** 蛮力、实现、数学、数论
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算不同值的数量$k$这样我们就可以表示给定的数字$l$作为$l = k \cdot a^x \cdot b^y$对于非负整数$x$和$y$。 换句话说，$k$是剩余因子$l$分解出 的幂后$a$和$b$在每一种可能的组合中。 每个测试用例给出三个整数$a$,$b$， 和$l$，我们必须输出不同的计数$k$满足此分解的值。 

约束表明$a$和$b$相对较小（$\le 100$） 尽管$l$可以达到$10^6$并且测试用例数量可以达到$10^4$。 这意味着任何迭代所有数字的解决方案$l$会太慢了。 我们需要一种仅探索乘法结构的方法$l$高效。 

当出现一个重要的微妙之处时$a$和$b$是相同质数的幂或共享共同质因数。 例如，如果$a = 4$和$b = 8$，然后乘以$a^x \cdot b^y$可以对 2 的同一个指数产生重叠的贡献。忽略质因数分解的简单方法可能会重复计算或错过可能性。 另一个边缘情况是当$l$不能被任何一个整除$a$或者$b$，这立即给出$k = l$。 

## 方法

 暴力方法会尝试所有非负幂$x$和$y$这样$a^x \le l$和$b^y \le l$，然后计算$k = l / (a^x \cdot b^y)$如果划分准确的话。 虽然正确，但这可能需要最多$(\log_a l) \cdot (\log_b l)$每个测试用例的迭代次数，这对于小型测试用例是可行的$l$，但可能成本高昂$t = 10^4$测试用例。 

关键的见解是我们只关心不同的价值观$k$，对应于除数$l$取消所有权力后$a$和$b$。 这表明我们可以使用乘法结构$l$有效地迭代权力：

 1. 预先计算所有幂$a$和$b$不超过$l$。 
2. 将每个组合相乘$a^x \cdot b^y$并检查它是否分开$l$。 如果是这样，$k = l / (a^x \cdot b^y)$是有效的。 
3. 商店$k$在一组中自动去重。 

这将问题简化为仅迭代有效幂，这比迭代所有整数小得多$l$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例 O((log l / log a) * (log l / log b)) | O(1) | O(1) | 对于大t来说太慢|
 | 最佳 | 每个测试用例 O((log l / log a) * (log l / log b)) | O(#distinct k) | O(#distinct k) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$a$,$b$， 和$l$。 
2.初始化一个空集`k_values`存储不同的结果。 
3. 生成权力列表$a$不超过$l$。 从 1 开始，反复乘以$a$直到超过$l$。 储存于`powers_a`。 
4. 同样，生成一个权力列表$b$不超过$l$。 储存于`powers_b`。 
5. 对于每个$p\_a$在`powers_a`和$p\_b$在`powers_b`, 计算`product = p_a * p_b`。 如果`l % product == 0`, 计算`k = l // product`并将其添加到`k_values`。 
6.检查完所有组合后，`k_values`是这个测试用例的答案。 输出它。 
7. 对所有测试用例重复此操作。 

为什么有效：通过迭代所有可行的幂$a$和$b$不超过$l$，我们保证每一个潜力$k$被考虑。 使用整数除法可确保只有精确的因式分解才起作用，并且该集合会删除重复项。 该方法避免了对不可能的组合进行不必要的迭代。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        a, b, l = map(int, input().split())
        k_values = set()
        
        powers_a = []
        x = 1
        while x <= l:
            powers_a.append(x)
            if l // x < a:
                break
            x *= a
            
        powers_b = []
        y = 1
        while y <= l:
            powers_b.append(y)
            if l // y < b:
                break
            y *= b
        
        for p_a in powers_a:
            for p_b in powers_b:
                product = p_a * p_b
                if product > l:
                    continue
                if l % product == 0:
                    k_values.add(l // product)
        
        print(len(k_values))

if __name__ == "__main__":
    solve()
```该代码通过检查仔细防止整数溢出`l // x < a`和`l // y < b`相乘之前，确保幂不超过`l`。 使用集合保证我们计算每个`k`只有一次。 

## 工作示例

 输入样本`2 5 20`:

 | x| y | ^x | ^y | 产品 | k = l / 乘积 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 | 1 | 20 |
 | 0 | 1 | 1 | 5 | 5 | 4 |
 | 1 | 0 | 2 | 1 | 2 | 10 | 10
 | 1 | 1 | 2 | 5 | 10 | 10 2 |
 | 2 | 0 | 4 | 1 | 4 | 5 |
 | 2 | 1 | 4 | 5 | 20 | 1 |

 全部六个`k`值被计算。 该算法有效地处理中小功率。 

输入样本`2 5 21`:

 | x| y | ^x | ^y | 产品 | k = l / 乘积 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 | 1 | 21 | 21

 所有其他权力`a`或者`b`超过`l`或不分开`l`。 该算法正确计算出 1 个值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * (log_al) * (log_b l)) | O(t * (log_al) * (log_b l)) | 每个测试用例生成 a 和 b 的幂，迭代组合。 当 a,b <= 100 且 l <= 10^6 时，对数限制很小。 |
 | 空间| O(#distinct k) | O(#distinct k) | 存储每个测试用例的所有不同 k 值，最多为 l，但通常要小得多。 |

 给定 t <= 10^4 且 l <= 10^6，该算法在时间限制下非常适合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("11\n2 5 20\n2 5 21\n4 6 48\n2 3 72\n3 5 75\n2 2 1024\n3 7 83349\n100 100 1000000\n7 3 2\n2 6 6\n17 3 632043\n") == "6\n1\n5\n12\n6\n11\n24\n4\n1\n3\n24"

# Custom cases
assert run("1\n2 2 1\n") == "1", "smallest l, a=b=2"
assert run("1\n2 3 6\n") == "4", "all factors count"
assert run("1\n5 5 25\n") == "3", "a=b same"
assert run("1\n100 100 1000000\n") == "4", "large a,b,l"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 2 1 | 2 2 1 1 | 最小的 l，a=b |
 | 2 3 6 | 4 | 多因素组合|
 | 5 5 25 | 5 5 25 3 | a=b 场景 |
 | 100 100 1000000 | 4 | 数量大，效率高|

 ## 边缘情况

 当`l`不能被任何一个整除`a`或者`b`，仅`
