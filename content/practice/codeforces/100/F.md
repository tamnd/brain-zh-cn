---
title: "CF 100F - 多项式"
description: "我们给出一个已经因式分解为线性项的多项式： $$p(x) = (x + a1)(x + a2)dots(x + an)$$ 任务是展开这个乘积并以通常的降幂形式打印多项式： $$x^n + b1x^{n-1} +dots + bn$$ 棘手的部分不是展开本身。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 100
codeforces_index: "F"
codeforces_contest_name: "Unknown Language Round 3"
rating: 1800
weight: 100
solve_time_s: 146
verified: true
draft: false
---

[CF 100F - 多项式](https://codeforces.com/problemset/problem/100/F)

 **评分：** 1800
 **标签：** *特殊、实施
 **求解时间：** 2m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出一个已经分解为线性项的多项式：$$p(x) = (x + a_1)(x + a_2)\dots(x + a_n)$$任务是展开该乘积并以通常的降幂形式打印多项式：$$x^n + b_1x^{n-1} + \dots + b_n$$棘手的部分不是扩展本身。 棘手的部分是完全按照要求格式化结果。 

每个术语必须以以下形式出现`C*X^K`，但尽可能缩短。 系数`1`在非常数项必须消失之前，指数`1`必须打印为`X`, 指数`0`必须省略`X`完全，并且用系数项`0`绝对不能出现。 标志还必须打印紧凑，没有多余的空格。 

度数最多为9，这是极小的。 即使具有指数行为的算法也可能在这里生存，但没有理由使用它们。 简单的多项式乘法方法需要数百次运算。 

格式规则是大多数错误答案发生的地方。 多项式本身很容易计算。 

当中间系数变为零时，就会出现一种微妙的边缘情况。 例如：```
2
-1
1
```多项式为：$$(x-1)(x+1)=x^2-1$$这`x`术语完全消失。 粗心的实现可能会打印`X^2+0*X-1`，这是无效的。 

另一个危险的情况是系数等于`1`或者`-1`。 考虑：```
1
1
```多项式为：$$x+1$$正确的输出是：```
X+1
```印刷`1*X+1`太冗长而被拒绝。 

指数格式也很重要。 例如：```
2
0
0
```给出：$$x^2$$输出必须是：```
X^2
```不是`X^2+0*X+0`。 

常数多项式也需要特殊处理。 例如：```
1
-3
```产生：$$x-3$$常数项没有`X`，而线性项没有指数。 

## 方法

 最直接的暴力想法是逐一乘以因子，同时显式存储每个系数。 

假设我们目前知道以下系数：$$(x+a_1)(x+a_2)\dots(x+a_k)$$然后乘以`(x + a_{k+1})`创建下一个多项式。 每个旧系数都会产生两个新系数，其中一个由于乘以`x`，并且由于乘以 1 不变`a_{k+1}`。 

这是可行的，因为多项式乘法自然分布在各项中。 

一个真正简单的暴力解决方案将枚举影响每个程度的每个因素子集。 由于系数为$x^{n-k}$是所有乘积的总和`k`选择的`a_i`，该方法需要检查所有子集。 和`n ≤ 9`， 甚至$2^9 = 512$子集是可以接受的，但实现会变得不必要的复杂。 

增量乘法方法更简洁，并且在概念上具有更好的扩展性。 每次乘法仅涉及当前多项式次数，因此复杂度变为二次。 

关键的观察结果是乘以线性多项式只会改变相邻系数。 如果：$$P(x)=c_0+c_1x+\dots+c_dx^d$$然后：$$P(x)(x+a)= ac_0+(c_0+ac_1)x+\dots+c_dx^{d+1}$$这种局部过渡使得动态多项式构造变得自然。 

计算系数后，剩下的挑战是确定性格式化。 由于该语句保证了唯一的有效输出，因此我们必须严格遵循最短表示规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 子集枚举 | O(2^n \cdot n) | O(2^n \cdot n) | O(2^n) | O(2^n) | 已接受 |
 | 增量多项式乘法 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1.读取所有值`a_i`。 
2.从常数多项式开始`1`。 

我们按程度递增的顺序存储系数。 最初：$$p(x)=1$$所以系数数组是：```
[1]
```3. 对于每个因素`(x + a)`创建一个大一级的新系数数组。 

如果当前系数为$x^i$是`c`，那么：

 乘以`a`贡献`c * a`达到程度`i`。 

乘以`x`贡献`c`达到程度`i+1`。 
4. 处理完每个因子后，用新多项式替换旧多项式。 

处理完所有因子后，数组包含展开多项式的每个系数。 
5. 从最高阶到最低阶遍历系数并构建答案字符串。 
6. 跳过系数等于0。 

带系数项`0`绝对不能出现。 
7. 小心处理标志。 

第一个打印术语不应以`+`。 

否定词应该以`-`。 
8. 以最短的法律形式格式化每个术语。 

对于学位`0`，仅打印系数。 

对于学位`1`， 打印`X`而不是`X^1`。 

对于系数`1`和`-1`对于非常数项，省略数字部分。 
9. 打印最终的字符串。 

### 为什么它有效

 处理完第一条后`k`因子，系数数组准确表示：$$(x+a_1)(x+a_2)\dots(x+a_k)$$这个不变量最初是正确的，因为多项式是`1`。 

当乘以`(x+a_{k+1})`，每一项通过分布性对新多项式做出正确的贡献。 乘以`a_{k+1}`保留度数，而乘以`x`度数加一。 由于每个贡献都只添加一次，因此所得系数是正确的。 

格式化阶段是正确的，因为每个系数都是根据语句的最短形式规则进行转换的，并且完全省略了零项。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def format_term(coef, deg, first):
    if coef == 0:
        return ""

    sign = ""
    if coef < 0:
        sign = "-"
    elif not first:
        sign = "+"

    val = abs(coef)

    if deg == 0:
        body = str(val)
    else:
        if val == 1:
            coef_part = ""
        else:
            coef_part = str(val) + "*"

        if deg == 1:
            body = coef_part + "X"
        else:
            body = coef_part + f"X^{deg}"

    return sign + body

def solve():
    n = int(input())
    a = [int(input()) for _ in range(n)]

    # coefficients by increasing degree
    poly = [1]

    for x in a:
        nxt = [0] * (len(poly) + 1)

        for deg, coef in enumerate(poly):
            nxt[deg] += coef * x
            nxt[deg + 1] += coef

        poly = nxt

    parts = []
    first = True

    for deg in range(n, -1, -1):
        term = format_term(poly[deg], deg, first)

        if term:
            parts.append(term)
            first = False

    print("".join(parts))

solve()
```多项式系数以递增的次数顺序存储，因为它简化了乘法期间的转换。 处理一个因素时`(x + a)`，每个现有系数恰好对下一个数组中的两个位置有贡献。 

更新：```
nxt[deg] += coef * x
nxt[deg + 1] += coef
```直接来自分配乘法。 

格式化功能将所有输出规则隔离在一处。 这避免了分散的特殊情况，并使正确性更容易推理。 

最容易出错的细节是处理系数`1`和`-1`。 例如：```
1*X^2
```无效，因为最短表示必须省略`1`。 

另一个微妙的点是符号处理。 第一个正项不能以`+`，而后面的每一个正项都必须。 

该循环从最大到最小打印度数，以便多项式以标准形式出现。 

## 工作示例

 ### 示例 1

 输入：```
2
-1
1
```我们计算：$$(x-1)(x+1)$$| 步骤| 因素 | 多项式系数|
 | --- | --- | --- |
 | 开始| - |`[1]`|
 | 后`x-1`|`-1`|`[-1, 1]`|
 | 后`x+1`|`1`|`[-1, 0, 1]`|

 系数数组的含义是：$$-1 + 0x + 1x^2$$这`x`项消失，因为它的系数为零。 

最终输出：```
X^2-1
```该跟踪说明了为什么必须跳过零系数。 

### 示例 2

 输入：```
3
1
1
1
```我们计算：$$(x+1)^3$$| 步骤| 因素 | 多项式系数|
 | --- | --- | --- |
 | 开始| - |`[1]`|
 | 第一次之后|`1`|`[1, 1]`|
 | 第二次之后|`1`|`[1, 2, 1]`|
 | 第三次之后 |`1`|`[1, 3, 3, 1]`|

 系数对应于：$$1 + 3x + 3x^2 + x^3$$从最高程度向下打印给出：```
X^3+3*X^2+3*X+1
```此示例确认了系数在重复乘法中正确累加。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每次乘法都会涉及所有当前系数 |
 | 空间| O(n) | 仅存储当前多项式 |

 和`n ≤ 9`，该算法仅执行几十个算术运算。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def format_term(coef, deg, first):
        if coef == 0:
            return ""

        sign = ""
        if coef < 0:
            sign = "-"
        elif not first:
            sign = "+"

        val = abs(coef)

        if deg == 0:
            body = str(val)
        else:
            if val == 1:
                coef_part = ""
            else:
                coef_part = str(val) + "*"

            if deg == 1:
                body = coef_part + "X"
            else:
                body = coef_part + f"X^{deg}"

        return sign + body

    n = int(input())
    a = [int(input()) for _ in range(n)]

    poly = [1]

    for x in a:
        nxt = [0] * (len(poly) + 1)

        for deg, coef in enumerate(poly):
            nxt[deg] += coef * x
            nxt[deg + 1] += coef

        poly = nxt

    parts = []
    first = True

    for deg in range(n, -1, -1):
        term = format_term(poly[deg], deg, first)

        if term:
            parts.append(term)
            first = False

    return "".join(parts)

# provided sample
assert run("2\n-1\n1\n") == "X^2-1", "sample 1"

# minimum size
assert run("1\n1\n") == "X+1", "single factor positive"

# zero coefficients in middle
assert run("2\n0\n0\n") == "X^2", "middle and constant zero"

# repeated values
assert run("3\n1\n1\n1\n") == "X^3+3*X^2+3*X+1", "binomial expansion"

# negative coefficient formatting
assert run("1\n-3\n") == "X-3", "constant negative"

# maximum degree style case
assert run("9\n0\n0\n0\n0\n0\n0\n0\n0\n0\n") == "X^9", "highest degree"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`X+1`| 省略系数`1`|
 |`2 0 0`|`X^2`| 删除零项 |
 |`3 1 1 1`|`X^3+3*X^2+3*X+1`| 正确系数累加 |
 |`1 -3`|`X-3`| 不断格式化|
 | 九个零 |`X^9`| 最大程度处理|

 ## 边缘情况

 考虑：```
2
-1
1
```多项式变为：$$(x-1)(x+1)=x^2-1$$在乘法过程中，系数数组变为：```
[-1, 0, 1]
```该算法跳过 1 次项，因为它的系数为零。 最终输出是：```
X^2-1
```这避免了无效的形式`X^2+0*X-1`。 

现在考虑：```
1
1
```系数数组为：```
[1, 1]
```当格式化 1 次项时，算法会检测系数`1`并抑制数字前缀。 输出变为：```
X+1
```而不是`1*X+1`。 

最后，考虑：```
2
0
0
```多项式为：$$x^2$$系数数组为：```
[0, 0, 1]
```两个较低阶项都被跳过。 该算法仅打印：```
X^2
```这是所需的最短表示。
