---
title: "CF 1250F - 数据中心"
description: "我们给定一个目标区域$n$，我们想要构建一个边长为整数且面积恰好为$n$的矩形。 每个有效矩形对应于选择两个整数 $a$ 和 $b$，使得 $a cdot b = n$。"
date: "2026-06-13T21:14:28+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1250
codeforces_index: "F"
codeforces_contest_name: "2019-2020 ICPC, NERC, Southern and Volga Russian Regional Contest (Online Mirror, ICPC Rules, Teams Preferred)"
rating: 800
weight: 1250
solve_time_s: 146
verified: true
draft: false
---

[CF 1250F - 数据中心](https://codeforces.com/problemset/problem/1250/F)

 **评分：** 800
 **标签：** 暴力破解、实施
 **求解时间：** 2m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了一个目标区域$n$，我们想要构建一个矩形，其边长为整数，其面积恰好为$n$。 每个有效矩形对应于选择两个整数$a$和$b$这样$a \cdot b = n$。 在所有这些因子对中，我们想要周长最小的矩形，即$2(a + b)$。 

所以任务纯粹是关于分解：在所有乘积固定的整数对中，我们想要最小化它们的总和的对。 从几何角度来看，这相当于使矩形尽可能接近正方形，因为平衡的边会减少固定面积的周长。 

约束条件$n \le 10^5$足够小以至于迭代到$\sqrt{n}$每次测试在恒定时间内是可行的。 对所有可能因素进行暴力破解$n$仍然会过去，但没有必要。 

粗心解决方案的一个微妙的失败案例是假设$a = \lfloor \sqrt{n} \rfloor$总是给出一个有效的矩形。 这仅在以下情况下有效$n$是一个完美的正方形。 例如，如果$n = 13$,$\lfloor \sqrt{13} \rfloor = 3$， 但$13$不能被整除$3$， 所以$3 \times 3$无效。 正确答案来自$1 \times 13$。 

另一个边缘情况是$n = 1$。 唯一的矩形是$1 \times 1$，所以周长是$4$。 任何依赖于因子搜索的逻辑仍然必须干净地处理这个问题。 

## 方法

 一个简单的方法是枚举每个可能的对$(a, b)$这样$a \cdot b = n$, 计算$2(a+b)$，并取最小值。 正确性是立即的，因为它检查所有有效的矩形。 问题是效率：扫描所有值$a$从$1$到$n$导致$O(n)$检查，这是不必要的和浪费的，即使$n$只是$10^5$。 

关键的观察是因素成对出现$\sqrt{n}$。 如果$a \cdot b = n$，那么至少其中之一$a, b$小于或等于$\sqrt{n}$。 这意味着我们只需要迭代$a$最多$\sqrt{n}$，并且每当$a$划分$n$，我们评估相应的对$(a, n/a)$。 

这将搜索空间从线性减小到平方根大小，同时仍然保证我们检查每个有效因子对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n)$|$O(1)$| 太慢了 |
 | 最优（因子扫描）|$O(\sqrt{n})$|$O(1)$| 已接受 |

 ## 算法演练

 1. 初始化变量`best`用一个非常大的值来存储迄今为止找到的最小周长。 这确保任何有效的矩形都会改进它。 
2. 迭代$a$从$1$到$\lfloor \sqrt{n} \rfloor$。 我们只搜索平方根，因为每个因子对必须至少有一个元素在此范围内。 
3. 对于每个$a$，检查是否$n \bmod a = 0$。 如果不是，请跳过它，因为它无法形成有效的矩形边。 
4. 如果能平分，则计算$b = n / a$。 这给出了一个有效的矩形$a \times b$。 
5. 计算周长$p = 2(a + b)$并更新`best = min(best, p)`。 每个有效因子对都是一个候选形状。 
6.循环结束后，输出`best`。 

### 为什么它有效

 每个有效矩形恰好对应一个因子对$(a, b)$和$a \le \sqrt{n}$或者$b \le \sqrt{n}$。 该循环保证我们通过较小的因子恰好遇到所有这些对。 由于周长仅取决于总和$a + b$，检查所有有效对可确保找到最小值而不会遗漏任何候选。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

best = 10**18
i = 1

while i * i <= n:
    if n % i == 0:
        j = n // i
        best = min(best, 2 * (i + j))
    i += 1

print(best)
```该解决方案在所有有效因子对上保持运行最小值。 循环条件`i * i <= n`避免浮点平方根并保证整数安全迭代。 每次找到除数时，我们都会立即使用整数除法形成配对因子，确保不会出现精度问题。 

## 工作示例

 ### 示例 1：$n = 36$| 我| 划分？ | j = 36/i | 周长$2(i+j)$| 最佳|
 | ---| ---| ---| ---| ---|
 | 1 | 是的 | 36 | 36 74 | 74 74 | 74
 | 2 | 是的 | 18 | 18 40 | 40 40 | 40
 | 3 | 是的 | 12 | 12 30| 30|
 | 4 | 是的 | 9 | 26 | 26 26 | 26
 | 5 | 没有| - | - | 26 | 26
 | 6 | 是的 | 6 | 24 | 24 |

 轨迹显示，随着因子对变得更加平衡，周长不断缩小，在平方处达到最小值$6 \times 6$。 

### 示例 2：$n = 13$| 我| 划分？ | j = 13/i | 周长| 最佳|
 | ---| ---| ---| ---| ---|
 | 1 | 是的 | 13 | 28 | 28 28 | 28
 | 2 | 没有| - | - | 28 | 28
 | 3 | 没有| - | - | 28 | 28

 仅存在一对有效因子，因此算法正确地回落到矩形$1 \times 13$。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(\sqrt{n})$| 我们测试每个整数直到$\sqrt{n}$一次|
 | 空间|$O(1)$| 只存储了几个整型变量 |

 上限$n \le 10^5$使$\sqrt{n} \le 316$，因此循环在时间限制下运行的迭代次数可以忽略不计。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline
    n = int(input())

    best = 10**18
    i = 1
    while i * i <= n:
        if n % i == 0:
            j = n // i
            best = min(best, 2 * (i + j))
        i += 1

    print(best)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    from io import StringIO
    out = StringIO()
    old_stdout = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = old_stdout
    sys.stdin = old_stdin
    return out.getvalue().strip()

# provided samples
assert run("36\n") == "24"
assert run("13\n") == "28"

# custom cases
assert run("1\n") == "4"
assert run("2\n") == "6"
assert run("49\n") == "28"
assert run("100000\n") == str(min(2*(i + 100000//i) for i in range(1, 100000+1) if 100000 % i == 0))
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 | 4 | 最小边界情况|
 | 2 | 6 | 最小非平方素数行为 |
 | 49 | 49 28 | 28 完美的方形表壳|

 ## 边缘情况

 对于$n = 1$，唯一有效的矩形是$1 \times 1$。 循环仍然执行一次$i = 1$，检测整除性并计算周长$2(1+1) = 4$，这与正确答案相匹配。 

对于像这样的素数$n = 13$，不存在除数，除了$1$，所以算法自然会回退到$1 \times 13$，产生周长$28$。 缺少内因数不需要特殊处理。 

对于完美的正方形，例如$n = 36$，发现多个因子对，最小值出现在中心对$6 \times 6$。 迭代可确保显式评估该对，因此永远不会错过最佳结构。
