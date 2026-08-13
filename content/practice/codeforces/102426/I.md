---
title: "CF 102426I - 整数因式分解"
description: "给定两个整数 a 和 b，由两个未知素数 p 和 q 生成：[ a=(pq)oplus(p+q), ] [ b=(pq)oplus(p-q)。 ] 任务是恢复原始有序对(p,q)。"
date: "2026-08-12T19:30:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "I"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 330
verified: true
draft: false
---

[CF 102426I - 整数分解](https://codeforces.com/problemset/problem/102426/I)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个整数`a`和`b`由两个未知素数生成`p`和`q`:

 [
 a=(pq)\oplus(p+q),
 ]

 [
 b=(pq)\oplus(p-q)。 
]

 任务是恢复原来的有序对`(p, q)`。 顺序很重要，因为第二个表达式包含`p-q`，所以交换两个素数通常会改变`b`。 

挑战在于`pq`本身并没有被给出。 普通的整数因式分解方法不能直接应用，因为没有已知的乘积来进行因式分解。 我们拥有的唯一信息是涉及乘积、总和和差的两个 XOR 表达式。 

输入包含最多 3000 个独立测试用例。 每个`a`和`b`适合有符号的 64 位整数。 这使得算法依赖于枚举值最多`2^63`完全不可能。 Even a linear scan over all possible prime values would already require billions or trillions of operations, while trying all pairs would be astronomically worse.

 直接实现必须正确处理几种边缘情况。 第一的，`p`可以小于`q`， 所以`p-q`是负数。 例如，与`p=2,q=3`,

 [
 pq=6,\quad p+q=5,\quad p-q=-1,
 ]

 所以

 [
 a=6\oplus5=3,
 ]

 在通常的补码解释下，

 [
 b=6\oplus(-1)=-7。 
]

 因此输入```
3 -7
```有输出```
2 3
```一个解决方案假设`p-q`是非负的会在这里失败。 

第二个边缘情况是`p=q`。 两个素数相等的唯一方法是两个素数相同。 为了`p=q=2`,

 [
 a=4\oplus4=0,\qquad b=4\oplus0=4,
 ]

 所以```
0 4
```必须产生```
2 2
```假设两个素数不同的粗心实现可能会拒绝这种有效情况。 

此处复制的声明中还存在一个微妙的输入格式问题。 正式的输入描述包含`T`，而显示的样本仅包含对`1279 1201`。 下面的实现接受这两种形式，因此它适用于正式的判断格式和显示的示例格式。 

## 方法

 最直接的方法就是猜测`p`和`q`, 计算

 [
 (pq)\oplus(p+q)
 ]

 和

 [
 (pq)\oplus(p-q),
 ]

 并将它们与`a`和`b`。 由于相关值可能是 64 位整数，因此这将需要巨大的搜索空间。 如果我们允许两个素数的范围超过 64 位值，则检查所有对将采用 (2^{128}) 候选者的顺序。 即使将搜索限制在可能产品的平方根周围的值也是不可能的，因为产品本身是未知的。 

有用的观察结果是，异或、加法、减法和乘法都与取模 2 的幂兼容。 最低的`k`的位`p*q`只依赖于最低的`k`的位`p`和`q`。 对于`p+q`和`p-q`。 因此，最低的`k`两个输出的位仅取决于最低位`k`两个未知素数的位。 

这为我们提供了一种完全不同的搜索方式。 不要立即猜测整个 64 位素数，而是从最低有效位向上重建它们。 

假设我们已经知道`k`可能对的低位`(p,q)`。 对于接下来的一点，只有四种可能：

 [
 (p_k,q_k)\in{0,1}\times{0,1}。 
]

 我们附加这四种可能性中的每一种，并计算两个表达式模 (2^{k+1})。 如果任一表达式与相应的低位不一致`a`或者`b`，该候选永远无法成为真正的解决方案，因为较高位无法更改普通加法、减法、乘法或异或的较低位。 

因此，强力搜索从猜测一个巨大的整数对变为维护一组非常小的有效低位前缀。 每个级别创建的前缀数量是原来的四倍，但是两个输出约束消除了大约四分之三。 这与紧密相关的 2018 USTC RSA 问题的官方解决方案中使用的逐位重构思想相同。 

对于 64 位实例，只需要 64 个级别。 在每个级别，我们对每个幸存的候选者执行恒定数量的算术。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^{128})) | (O(1)) | (O(1)) | 太慢了|
 | 最佳 | (O(64C))，预期 (O(64)) | (O(C)) | 已接受 |

 这里`C`是存活位前缀的最大数量。 两个独立的 XOR 方程保持`C`实际上非常小，有效地提供了位数的线性工作。 

## 算法演练

 1. 从唯一可能的零位前缀开始，`(p,q)=(0,0)`。 尚未选择任一质数的任何位。 
2. 从最低有效位到最高有效位处理位。 在钻头位置`k`，每个幸存的对都已经过模 (2^k) 验证。 
3. 对于每一对幸存的配对，尝试接下来的所有四种选择`p`和`q`。 如果当前前缀是`(x,y)`，四个扩展分别是

 [
 (x,y),\四元组
 (x+2^k,y),\quad
 (x,y+2^k),\quad
 (x+2^k,y+2^k)。 
]

 1. 对于每个扩展，计算

 [
 f_1(x,y)=(xy)\oplus(x+y)
 ]

 和

 [
 f_2(x,y)=(xy)\oplus(x-y)。 
]

 只有他们最低的`k+1`在这个阶段，比特很重要。 使用面膜

 [
 2^{k+1}-1
 ]

 丢弃所有较高位。 

1. 仅在以下情况下才保留扩展名：

 [
 f_1(x,y)\bmod 2^{k+1}=a\bmod 2^{k+1}
 ]

 和

 [
 f_2(x,y)\bmod 2^{k+1}=b\bmod 2^{k+1}。 
]

 这种修剪是有效的，因为对整数的操作不能使高位改变已经确定的低位。 

1. 重建足够的位后，使用完整的表达式而不是仅使用其屏蔽版本来检查每个幸存的候选者。 当

 [
 f_1(p,q)=a
 ]

 和

 [
 f_2(p,q)=b,
 ]

 我们已经恢复了所需的有序对。 

1.我们使用64个重建位。 给定的输出是带符号的 64 位值，并且相应的素因数在问题所需的范围内。 Python 的任意精度整数还让我们能够在不溢出的情况下计算最终结果。 

为什么它有效

 不变量是处理位后`k`，每个幸存的候选人`(x,y)`具有完全相同的最低值`k`位作为一些可能的解决方案`(p,q)`，并且每个被丢弃的候选不可能具有相同的输出位。 原因就在于低`k`乘法、加法、减法和异或的位仅取决于低位`k`他们的操作数的位。 因此，候选人被一级拒绝`k`永远无法通过选择不同的较高位来修复。 相反，真实的`(p,q)`通过每个级别，因为它的前缀产生完全对应的前缀`a`和`b`。 在处理完所有相关位后，实际的对仍然存在，并且最终的精确检查会删除任何不代表完整解决方案的剩余前缀。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(a, b):
    def f1(x, y):
        return (x * y) ^ (x + y)

    def f2(x, y):
        return (x * y) ^ (x - y)

    candidates = {(0, 0)}

    for bit in range(64):
        mask = (1 << (bit + 1)) - 1
        target_a = a & mask
        target_b = b & mask

        next_candidates = set()

        for x, y in candidates:
            add = 1 << bit

            for bx in (0, 1):
                xx = x + bx * add

                for by in (0, 1):
                    yy = y + by * add

                    if (f1(xx, yy) & mask) != target_a:
                        continue

                    if (f2(xx, yy) & mask) != target_b:
                        continue

                    next_candidates.add((xx, yy))

        candidates = next_candidates

        # A complete solution may be smaller than 2^(bit+1).
        for x, y in candidates:
            if f1(x, y) == a and f2(x, y) == b:
                return x, y

        if not candidates:
            break

    # The problem guarantees a unique solution.
    for x, y in candidates:
        if f1(x, y) == a and f2(x, y) == b:
            return x, y

    raise ValueError("No solution found")

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return

    # The formal statement has T, while the displayed sample omits it.
    if len(data) >= 3 and len(data) == 1 + 2 * data[0]:
        t = data[0]
        values = data[1:]
    else:
        t = len(data) // 2
        values = data

    out = []

    for i in range(t):
        a = values[2 * i]
        b = values[2 * i + 1]
        p, q = solve_case(a, b)
        out.append(f"{p} {q}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这两个辅助函数直接对问题中的两个表达式进行编码。 将它们分开可以使位前缀条件易于阅读，并避免在第二个表达式中意外使用错误的符号。`mask = (1 << (bit + 1)) - 1`准确保留迄今为止已重建的位。 与的比较`a & mask`和`b & mask`是中央修剪操作。 

嵌套循环结束`bx`和`by`为下一位生成所有四种可能的分配。 一个常见的错误是对现有候选进行适当修改。 相反，四种可能性中的每一种都必须被视为独立的候选人。 

该代码故意不使用固定宽度整数算术。 Python 整数可以表示乘积`x*y`准确地说，即使它比带符号的 64 位整数大得多。 这在最终验证期间很重要，因为乘积可以占用比任一输入更多的位。 

负值`b`也需要呵护。 Python 对负整数的按位运算使用无限的补码表示，它给出与固定宽度有符号整数相同的低位。 由于每个中间比较都被屏蔽`mask`，相关的低位正是问题所需要的。 

精确的比较是在每个级别之后以及主循环之后执行的。 如果真素数很小，它们的高位就为零，因此在处理所有 64 个级别之前，完整的表达式就已经可以匹配。 

## 工作示例

 ### 示例 1

 对于样本，```
a = 1279
b = 1201
```答案是`39 31`。 

实数对的二进制前缀可以从最低有效位向上排列。 

| 位处理 | 面膜|`p`前缀 |`q`前缀 |`a & mask`|`b & mask`|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 | 1 | 1 |
 | 1 | 3 | 3 | 3 | 3 | 1 |
 | 2 | 7 | 7 | 7 | 7 | 1 |
 | 3 | 15 | 15 7 | 15 | 15 15 | 15 1 |
 | 4 | 31 | 7 | 31 | 31 | 17 | 17
 | 5 | 63 | 63 39 | 39 31 | 63 | 63 49 | 49

 在每一行，真实前缀都满足两个输出约束。 例如，在六位之后，完整的值已经是`39`和`31`，所以精确的表达式给出

 [
 39\cdot31=1209,
 ]

 [
 39+31=70，
 ]

 [
 39-31=8,
 ]

 因此

 [
 第1209章\oplus70=1279,
 ]

 [
 1209\oplus8=1201.
 ]

 该迹线展示了中心不变量：一旦低位与任一输出不兼容，则没有更高位可以修复它。 

### 自定义示例 2

 采取```
a = 3
b = -7
```预期的答案是`2 3`。 

| 位处理 | 面膜|`p`前缀 |`q`前缀 |`a & mask`|`b & mask`|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 1 | 1 | 1 |
 | 1 | 3 | 2 | 3 | 3 | 1 |

 完整的值为`p=2`和`q=3`。 我们得到

 [
 pq=6,\quad p+q=5,\quad p-q=-1,
 ]

 所以

 [
 6\oplus5=3
 ]

 和

 [
 6\oplus(-1)=-7。 
]

 该示例专门练习了签名的 XOR 情况。 候选过滤只需要低位，其中 Python 的负整数表示与补码算法的行为一致。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(64C))，预期 (O(64)) | 每个 64 位位置都以四种方式扩展每个幸存候选者并检查两个表达式。 |
 | 空间| (O(C)) | 仅存储当前和下一个候选集。 |

 关键参数是`C`，在一层中存活的前缀数量。 每个候选都有四种可能的扩展，而两个输出位提供两个独立的二进制约束。 预计幸存人数仍然很少，而不是呈指数增长。 只需 64 个相关位和最多 3000 个测试用例，这在 Python 中很容易实现。 

内存使用量也很小，因为该算法从不存储大型搜索树。 它仅保留有效前缀的当前边界。 

## 测试用例```python
import sys
import io

def solve_case(a, b):
    def f1(x, y):
        return (x * y) ^ (x + y)

    def f2(x, y):
        return (x * y) ^ (x - y)

    candidates = {(0, 0)}

    for bit in range(64):
        mask = (1 << (bit + 1)) - 1
        target_a = a & mask
        target_b = b & mask
        next_candidates = set()
        add = 1 << bit

        for x, y in candidates:
            for bx in (0, 1):
                xx = x + bx * add
                for by in (0, 1):
                    yy = y + by * add

                    if (f1(xx, yy) & mask) != target_a:
                        continue
                    if (f2(xx, yy) & mask) != target_b:
                        continue

                    next_candidates.add((xx, yy))

        candidates = next_candidates

        for x, y in candidates:
            if f1(x, y) == a and f2(x, y) == b:
                return x, y

    for x, y in candidates:
        if f1(x, y) == a and f2(x, y) == b:
            return x, y

    raise ValueError("No solution")

def run(inp: str) -> str:
    data = list(map(int, inp.split()))

    if len(data) >= 3 and len(data) == 1 + 2 * data[0]:
        t = data[0]
        data = data[1:]
    else:
        t = len(data) // 2

    ans = []
    for i in range(t):
        p, q = solve_case(data[2 * i], data[2 * i + 1])
        ans.append(f"{p} {q}")

    return "\n".join(ans)

# Provided sample, as displayed in the statement.
assert run("1279 1201") == "39 31", "sample 1"

# Same sample using the formal T-based input format.
assert run("1\n1279 1201\n") == "39 31", "sample 1 with T"

# Minimum prime pair, including negative p-q.
assert run("3 -7") == "2 3", "minimum-size ordered pair"

# Equal primes.
assert run("0 4") == "2 2", "equal primes"

# Reversed small primes.
assert run("3 7") == "3 2", "reversed ordered pair"

# A larger boundary-style case.
assert run("2147483647 2147483651") == "2147483647 2", "large prime boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 -7`|`2 3`| 处理负面`p-q`并签署了异或。 |
 |`0 4`|`2 2`| 处理相等素数和零差。 |
 |`3 7`|`3 2`| 确认顺序`p`和`q`被保留。 |
 |`2147483647 2147483651`|`2147483647 2`| 练习大型 31 位素数和许多重构级别。 |

 ## 边缘情况

 负差异情况的处理无需特殊分支。 为了```
3 -7
```正确的一对是`(2,3)`。 在低位电平，`-7`具有与其补码表示相同的低位，并且掩码为`1`,`3`,`7`，依此类推，精确提取必须匹配的位。 重建后`2`和`3`, Python 计算`6 ^ -1`作为`-7`，所以最终的精确检查成功。 

等质的情况是```
0 4
```有答案`(2,2)`。 该算法不假设`p-q`是非零的。 它的第二个表达式就变成了`4 ^ 0`，即`4`。 两位重构达到`(2,2)`，并且精确检查接受它。 

逆序情况是```
3 7
```有答案`(3,2)`。 虽然如果交换素数，乘积和和不会改变，但差值会改变`1`到`-1`。 因此第二个方程区分了两个方向。 该算法重建有序对，因为它总是处理`p`和`q`分别地。 

大边界情况是```
2147483647 2147483651
```有答案`(2147483647,2)`。 这里

 [
 pq=4294967294,
 ]

 [
 p+q=2147483649,
 ]

 [
 p-q=2147483645。 
]

 第一个异或是

 [
 4294967294\oplus2147483649=2147483647,
 ]

 而第二个是

 [
 4294967294\oplus2147483645=2147483651。 
]

 这些因子需要 31 个重建位，因此这种情况会检查实现不会在少量固定次数的迭代后意外停止，或者将处理的位数与`a`或者`b`。 

核心教训是，这个问题乍一看就像整数因式分解。 实际的结构是二进制前缀的约束系统。 一旦将两个 XOR 方程视为 2 的模递增幂，就可以一次一位地重构未知素数，从而避免任何通用分解算法。
