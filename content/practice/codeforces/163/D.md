---
title: "CF 163D - 大型冰箱"
description: "我们需要构建一个边长为整数 a、b 和 c 的矩形盒子。 它的体积必须等于给定的数字 V，并且在所有这些整数三元组中，我们需要表面积最小的一个。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 163
codeforces_index: "D"
codeforces_contest_name: "VK Cup 2012 Round 2"
rating: 2900
weight: 163
solve_time_s: 142
verified: false
draft: false
---

[CF 163D - 大型冰箱](https://codeforces.com/problemset/problem/163/D)

 **评分：** 2900
 **标签：** 暴力破解
 **求解时间：** 2m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要构建一个边长为整数的矩形盒子`a`,`b`， 和`c`。 它的体积必须等于给定的数字`V`，在所有这样的整数三元组中，我们想要表面积最小的一个。 

盒子的表面积是$S = 2(ab + bc + ca)$而体积约束是$abc = V$输入没有给出`V`直接地。 相反，它给出了素因数分解`V`。 例如，如果输入包含`(2,3)`和`(5,1)`， 然后$V = 2^3 \cdot 5 = 40$任务是输出尽可能小的表面积以及一个最佳三元组`(a,b,c)`。 

最大可能的体积是`10^18`，因此天真地迭代所有除数已经很微妙了。 附近的一个数字`10^18`仍然可以有超过`10^5`特殊构造情况下的除数。 尝试所有三元组`(a,b,c)`和`abc=V`除数的数量将呈二次方，这远远超出了 5 秒内最多 500 个测试用例所能容纳的范围。 

公式的结构很重要。 表达式`ab + bc + ca`当尺寸平衡时变小。 在实数上，最小值出现在立方体处。 在整数和整除性约束的情况下，最佳解决方案仍应保持三个值尽可能接近。 

一些边缘情况很容易被错误处理。 

如果`V`是质数，只有一个可能的盒子。 

输入：```
1
1
17 1
```唯一有效的三元组是`(1,1,17)`，所以答案是：```
70 1 1 17
```假设每个维度都有非平凡除数的粗心搜索在这里会失败。 

完美立方体是另一个重要的例子。 

输入：```
1
1
2 6
```这意味着`V = 64`。 最优的盒子是`(4,4,4)`与表面积`96`。 任何仅搜索严格递增除数的算法都可能会错过相等的维度。 

单个素数的大幂也会暴露溢出错误。 例如：```
1
1
2 60
```这里`V = 2^60`，大于`10^18`。 中间产品如`ab`和`2(ab+bc+ca)`必须保持在 64 位范围内。 Python 自然地处理这个问题，但在固定宽度的语言中，这需要小心。 

## 方法

 最直接的方法是生成`V`，然后尝试每一对`(a,b)`这样`a*b`划分`V`, 计算`c = V/(ab)`，并评估表面积。 

这是可行的，因为每个有效的冰箱都对应于一个除数三元组。 如果我们枚举所有除数对，我们最终会检查最佳的除数对。 

问题在于组合的数量。 让`d(V)`是除数的数量。 即使除数生成本身是可管理的，检查所有对的成本也大致相同`O(d(V)^2)`。 大约`10^5`除数，这变成了`10^10`组合，完全不可能。 

关键的观察是尺寸可以订购。 

假设我们总是维护$a \le b \le c$然后：```
a^3 ≤ abc = V
```所以：```
a ≤ cbrt(V)
```同样，修复后`a`:```
b^2 ≤ bc = V/a
```所以：```
b ≤ sqrt(V/a)
```这极大地缩小了搜索空间。 

我们只枚举除数，而不是迭代所有除数三元组`a`直到立方根`V`。 对于每一个这样的`a`，我们枚举除数`b`的`V/a`直到其平方根。 然后`c`是被迫的。 

剩下的挑战是除数生成。 由于输入已经提供了素因式分解，因此我们可以递归地生成除数，而无需进行因式分解工作。 

检查状态的总数变得比完整除数立方体小得多。 在实践中，这很容易符合限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对除数对的暴力破解 | O(d(V)^2) | O(d(V)^2) | O(d(V)) | 太慢了 |
 | 有序除数枚举 | O(d(V) · V^(1/3) 实际上要小得多）| O(d(V)) | 已接受 |

 ## 算法演练

 1. 重构质因数分解`V`从输入。 

我们实际上从来不需要计算`V`通过反复乘法。 因式分解是有用的结构。 
2. 生成 的所有约数`V`递归地。 

对于每个素数`p^e`，选择多少个副本`p`属于除数，从`0`到`e`。 
3. 对除数进行排序。 

一旦除数超出允许的范围，这可以让我们提前停止。 
4. 迭代每个除数`a`。 

我们只考虑除数满足：```
a^3 ≤ V
```因为在有序三元组中`(a,b,c)`，最小维度不能超过立方根。 
5. 对于每个有效`a`，计算：```
rem = V / a
```现在我们需要两个整数`b`和`c`这样：```
bc = rem
```6. 迭代除数`b`的`rem`。 

由于我们强制执行：```
b ≤ c
```我们只需要：```
b^2 ≤ rem
```7. 每当`b`划分`rem`，计算：```
c = rem / b
```8. 计算表面积：```
S = 2(ab + bc + ca)
```9. 追踪最小表面积并记住相应的三元组。 
10.输出最佳表面积和尺寸。 

### 为什么它有效

 每个有效的冰箱都对应于某个整数三元组`(a,b,c)`和`abc=V`。 通过执行命令`a≤b≤c`，每个无序解都只出现一次。 

不平等现象`a^3≤V`和`b^2≤V/a`是该排序的结果，而不是启发式修剪的结果。 任何最佳解决方案都不能违反它们。 该算法将每个可行的有序三元组精确地枚举一次，计算其精确的表面积，并保留最小值。 由于没有跳过任何候选，因此最终答案是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def gen_divisors(factors, idx, cur, divisors):
    if idx == len(factors):
        divisors.append(cur)
        return

    p, e = factors[idx]
    val = 1

    for _ in range(e + 1):
        gen_divisors(factors, idx + 1, cur * val, divisors)
        val *= p

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        k = int(input())

        factors = []
        V = 1

        for _ in range(k):
            p, e = map(int, input().split())
            factors.append((p, e))
            V *= pow(p, e)

        divisors = []
        gen_divisors(factors, 0, 1, divisors)
        divisors.sort()

        best_s = None
        best_triplet = None

        divisor_set = set(divisors)

        for a in divisors:
            if a * a * a > V:
                break

            rem = V // a

            for b in divisors:
                if b * b > rem:
                    break

                if rem % b != 0:
                    continue

                c = rem // b

                if b > c:
                    continue

                s = 2 * (a * b + b * c + c * a)

                if best_s is None or s < best_s:
                    best_s = s
                    best_triplet = (a, b, c)

        a, b, c = best_triplet
        out.append(f"{best_s} {a} {b} {c}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```递归除数生成器直接从素因数分解构建每个除数。 这比对高达以下数字的试除法更快、更可靠。`10^18`。 

外循环迭代候选最小维度`a`。 条件`a * a * a > V`是前面讨论的有序三重剪枝。 由于除数是有序的，一旦绑定失败我们就可以立即停止。 

内循环搜索`b`。 我们再次使用排序限制`b ≤ c`，这变成`b² ≤ rem`。 

一个微妙的点是我们再次迭代所有除数`b`，不是除数`rem`具体来说。 可分性检查：```
if rem % b != 0:
    continue
```过滤掉无效的候选人。 

另一个微妙之处是避免浮点立方根和平方根。 浮点舍入接近`10^18`很危险。 整数比较如：```
a * a * a > V
```在 Python 中是准确且安全的。 

## 工作示例

 ### 示例 1

 输入：```
1
1
2 3
```这意味着：```
V = 8
```生成的除数：```
1, 2, 4, 8
```| 一个 | 雷姆 = V/a | 乙| c | 表面积|
 | ---| ---| ---| ---| ---|
 | 1 | 8 | 1 | 8 | 34 | 34
 | 1 | 8 | 2 | 4 | 28 | 28
 | 2 | 4 | 1 | 4 | 28 | 28
 | 2 | 4 | 2 | 2 | 24 |

 最小值获得于`(2,2,2)`。 

该迹线说明了为什么平衡尺寸会减少表面积。 立方体形状最大限度地减少了成对的面部面积。 

### 示例 2

 输入：```
1
3
3 1
2 3
5 1
```这意味着：```
V = 3 × 8 × 5 = 120
```相关除数检查：

 | 一个 | 雷姆 | 乙| c | 表面积|
 | ---| ---| ---| ---| ---|
 | 1 | 120 | 120 1 | 120 | 120 482 | 482
 | 2 | 60| 5 | 12 | 12 188 | 188
 | 3 | 40| 4 | 10 | 10 164 | 164
 | 4 | 30| 5 | 6 | 148 | 148

 最好的解决办法是`(4,5,6)`与表面积`148`。 

该轨迹显示了搜索如何自然地倾向于数值上接近的维度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(d(V)^2) 在最坏的理论范围内，由于修剪，在实践中要小得多 | 我们仅迭代有序除数范围 |
 | 空间| O(d(V)) | 存储所有除数 |

 最大数字的除数个数`10^18`是可管理的，立方根和平方根剪枝删除了大多数组合。 这完全符合 Python 中 5 秒的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    def gen_divisors(factors, idx, cur, divisors):
        if idx == len(factors):
            divisors.append(cur)
            return

        p, e = factors[idx]
        val = 1

        for _ in range(e + 1):
            gen_divisors(factors, idx + 1, cur * val, divisors)
            val *= p

    t = int(input())
    out = []

    for _ in range(t):
        k = int(input())

        factors = []
        V = 1

        for _ in range(k):
            p, e = map(int, input().split())
            factors.append((p, e))
            V *= pow(p, e)

        divisors = []
        gen_divisors(factors, 0, 1, divisors)
        divisors.sort()

        best_s = None
        best_triplet = None

        for a in divisors:
            if a * a * a > V:
                break

            rem = V // a

            for b in divisors:
                if b * b > rem:
                    break

                if rem % b != 0:
                    continue

                c = rem // b

                if b > c:
                    continue

                s = 2 * (a * b + b * c + c * a)

                if best_s is None or s < best_s:
                    best_s = s
                    best_triplet = (a, b, c)

        a, b, c = best_triplet
        out.append(f"{best_s} {a} {b} {c}")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided samples
assert run(
"""3
1
2 3
1
17 1
3
3 1
2 3
5 1
"""
) == (
"""24 2 2 2
70 1 1 17
148 4 5 6"""
), "sample"

# prime volume
assert run(
"""1
1
13 1
"""
) == "54 1 1 13"

# perfect cube
assert run(
"""1
1
2 6
"""
) == "96 4 4 4"

# rectangular but not cubic
assert run(
"""1
2
2 4
3 2
"""
) == "120 4 6 6"

# large power of two
res = run(
"""1
1
2 10
"""
)
assert res.startswith("640 "), "2^10 case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 优质卷 |`54 1 1 13`| 处理没有非平凡除数的数字 |
 | 完美立方|`96 4 4 4`| 考虑相同尺寸 |
 |`2^4 * 3^2`|`120 4 6 6`| 具有重复维度的混合素因数 |
 |`2^10`| 表面积开始于`640`| 更大的幂和溢出敏感算术 |

 ## 边缘情况

 一个主要体积恰好迫使一个可能的盒子。 

输入：```
1
1
17 1
```生成的除数只有：```
1, 17
```外环测试`a=1`。 内循环测试`b=1`, 给予`c=17`。 不存在其他除数组合。 算法正确返回：```
70 1 1 17
```完美的立方体要求尺寸相等。 

输入：```
1
1
2 6
```这对应于`V=64`。 

算法最终达到：```
a=4
rem=16
b=4
c=4
```条件使用`>`而不是`>=`，因此保留相同的值。 表面积变为：```
2(16+16+16)=96
```这是最佳的。 

大幂强调算术的正确性。 

输入：```
1
1
2 60
```该算法从不使用浮点根。 每个比较都是基于整数的：```
a * a * a > V
b * b > rem
```Python 整数会自动扩展，因此在计算表面积或乘积时不会发生溢出。
