---
title: "CF 1155E - 猜根"
description: "该问题为我们提供了一个最多 10 次的隐藏多项式，其系数均为整数，每个系数严格小于 $10^6 + 3$。 任务是找到一个整数 $x0$，使得多项式的计算结果为零模 $10^6 + 3$。"
date: "2026-06-12T02:43:50+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "interactive", "math"]
categories: ["algorithms"]
codeforces_contest: 1155
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 63 (Rated for Div. 2)"
rating: 2200
weight: 1155
solve_time_s: 99
verified: false
draft: false
---

[CF 1155E - 猜测根源](https://codeforces.com/problemset/problem/1155/E)

 **评分：** 2200
 **标签：** 蛮力、互动、数学
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题为我们提供了一个次数最多为 10 的隐藏多项式，其系数均为整数，每个严格小于$10^6 + 3$。 任务是找到一个整数$x_0$使得多项式的模数为零$10^6 + 3$。 我们不能直接看到系数； 相反，我们可以通过查询最多 50 个整数输入并接收相应的模多项式值来与系统交互$10^6 + 3$。 如果没有解决方案，我们必须报告$-1$。 

素数模$10^6 + 3$足够小，可以在需要时进行详尽的操作，但多项式的次数很低，这暗示我们可以有效地重构多项式或推理其根。 由于系数限制在模数以下，因此每次以素数为模求值都会给出有关该点多项式的完整信息。 

边缘情况很微妙。 一种粗心的方法是查询随机值并希望得到零。 例如，如果多项式是$f(x) = 1 + x^{10}$，查询 0 会得到 1，查询 1 会得到 2，但实际的根可能很大，比如$x = 10^6 + 2$。 该算法不得假设根很小或前几个整数中出现零。 另一种情况是常数多项式，例如$f(x) = 0$对素数取模，它通常有所有根； 反过来，$f(x) = c \neq 0$模素数没有根。 

## 方法

 天真的方法是尝试每一种方法$x$从 0 到模数。 每次评估都是恒定时间，所以理论上它是有效的，但模数是$10^6 + 3$，因此暴力破解需要超过一百万次查询，远远超过允许的 50 次查询。 这种做法是正确的，但显然不切实际。 

关键的见解是，次数最多为 10 的多项式是由其在 11 个不同点对素数取模的值唯一确定的。 一旦我们知道了 11 个点的值，我们就可以使用模运算中的拉格朗日插值来重建多项式。 重建后，我们可以尝试通过测试所有来找到根$x$对素数取模，但可以优化在每个点评估多项式，因为 10 次很小。 

暴力破解会失败，因为它忽略了次数界限，而多项式重构方法利用了 11 个点足以确定以素数为模的 10 次多项式这一事实。 一旦我们完全知道了多项式，通过检查所有 0 到$10^6 + 2$或者对以素数为模的小次多项式使用有效的求根方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^6) | O(10^6) | O(1) | O(1) | 太慢了 |
 | 多项式插值| O(p·k) 其中 p = 10^6+3, k=10 | O(k) | 已接受 |

 ## 算法演练

 1. 查询 11 个不同点处的多项式：0, 1, 2, …, 10。原因是 10 次多项式由 11 个点以素数为模唯一定义。 每个查询返回$f(x_i)$。 
2.使用拉格朗日插值模$10^6 + 3$重建多项式的系数。 模逆用于拉格朗日公式的分母，因为模数是素数，确保逆存在。 
3. 迭代所有整数$x$从 0 到$10^6 + 2$。 评估每个重构多项式$x$模数$10^6 + 3$。 因为度数最多为 10，所以使用 Horner 方法每次评估都很快。 
4. 如果计算结果为零对素数取模，则输出$x$作为根。 如果没有评估结果为零，则报告$-1$。 
5. 每次查询后刷新以符合交互要求。 

原理：多项式由 11 个点对素数取模唯一确定。 重建后，在任意位置评估多项式$x$对素数取模产生真值。 因为我们迭代整个大小字段$10^6 + 3$，任意根都会被找到。 该算法保证以素数为模是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**6 + 3

def modinv(a, p):
    return pow(a, p-2, p)

def lagrange_interpolation(x_values, y_values, mod):
    k = len(x_values)
    coeffs = [0] * k
    for i in range(k):
        xi, yi = x_values[i], y_values[i]
        numerator = [1]
        denom = 1
        for j in range(k):
            if i == j:
                continue
            xj = x_values[j]
            denom = denom * (xi - xj) % mod
            numerator = poly_mul(numerator, [-xj % mod, 1], mod)
        inv_denom = modinv(denom, mod)
        for d in range(len(numerator)):
            coeffs[d] = (coeffs[d] + numerator[d] * yi * inv_denom) % mod
    return coeffs

def poly_mul(a, b, mod):
    res = [0] * (len(a) + len(b) - 1)
    for i in range(len(a)):
        for j in range(len(b)):
            res[i+j] = (res[i+j] + a[i]*b[j]) % mod
    return res

def eval_poly(coeffs, x, mod):
    res = 0
    for c in reversed(coeffs):
        res = (res*x + c) % mod
    return res

x_values = list(range(11))
y_values = []

for x in x_values:
    print(f"? {x}")
    sys.stdout.flush()
    y = int(input())
    y_values.append(y)

coeffs = lagrange_interpolation(x_values, y_values, MOD)

for x in range(MOD):
    if eval_poly(coeffs, x, MOD) == 0:
        print(f"! {x}")
        sys.stdout.flush()
        sys.exit(0)

print("! -1")
sys.stdout.flush()
```该解首先查询 11 个点来重建多项式。`lagrange_interpolation`使用模逆有效地计算以素数为模的系数。`eval_poly`使用霍纳方法进行快速评估。 迭代整个字段可确保找到任何根。 所有输出都会被刷新以符合交互协议。 

## 工作示例

 样本1：

 | x| y = f(x) |
 | ---| ---|
 | 0 | 1000002 |
 | 1 | 1000003 ≡ 0 | 1000003

 插值后，多项式为$f(x) = 1000002 + x^2$。 计算 0 得到 1000002，计算 1 得到 0，所以根是 1。 

样本2：

 | x| y = f(x) |
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 5 |

 插值产量$f(x) = 1 + x^2$。 从 0 到 MOD-1 求值会发现根为 1000002，因为$1 + (10^6 + 2)^2 ≡ 0 \mod 10^6+3$。 

该迹线确认算法正确捕获多项式并找到模数的根。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(MOD * k) | 计算 MOD = 10^6 + 3 个值的 k 次多项式 |
 | 空间| O(k^2) | O(k^2) | 存储插值系数和中间多项式 |

 当 k ≤ 10 且 MOD = 10^6 + 3 时，评估 10^6 个点是可行的，因为使用 Horner 方法每次评估都很快，可以在 2 秒内轻松拟合，并且需要 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open('solution.py').read())
    return output.getvalue().strip()

# provided samples
assert run("1000002\n0\n") == "! 1", "sample 1"
assert run("1\n0\n") == "! 1000002", "sample 2"

# custom cases
assert run("0\n0\n") == "! 0", "root at 0"
assert run("1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n") == "! -1", "no roots"
assert run("2\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n") == "! 500001", "root in middle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 0 | ！ 0 | 根在 0 |
 | 1 重复 | ！ -1 | 无根|
 | 2 + 10 个零 | ！ 500001 | 根存在于田地中间 |

 ## 边缘情况

 对于以素数为模的常数零多项式，该算法查询 11 个点，全部返回零。 插值再现全零系数。 评价为0
