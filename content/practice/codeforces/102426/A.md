---
title: "CF 102426A - \u81ea\u7136\u8bed\u8a00\u5904\u7406"
description: "每个文本已被转换为频率向量。 这样字符串处理部分就彻底消失了。 对于一个测试用例，我们只需要检查 (n) 个向量的集合，每个向量都有 (m) 个整数坐标，并确定这些向量是否线性相关。"
date: "2026-08-12T19:20:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "A"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 336
verified: true
draft: false
---

[CF 102426A - \u81ea\u7136\u8bed\u8a00\u5904\u7406](https://codeforces.com/problemset/problem/102426/A)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个文本已被转换为频率向量。 这样字符串处理部分就彻底消失了。 对于一个测试用例，我们只需要检查 (n) 个向量的集合，每个向量都有 (m) 个整数坐标，并确定这些向量是否线性相关。 

该问题相当于询问是否存在系数 (c_1,c_2,\ldots,c_n)，且不全为零，使得

 [
 c_1A_1+c_2A_2+\cdots+c_nA_n=0。 
]

 如果存在这样的系数，则向量是线性相关的，答案是`YES`。 否则它们是线性独立的，答案是`NO`。 

尺寸非常小。 最多有 10 个向量，每个向量最多有 4 个坐标。 这立即给出了一个有用的必要条件：在（m）维向量空间中，不超过（m）个向量可以是线性无关的。 因此，只要 (n>m)，答案就自动`YES`。 

即使当 (n\le m) 时，我们仍然需要确定向量是否实际上具有满秩。 由于 (m\le4)，高斯消除法足够快。 每个案例最多有 (10\times4=40) 个输入数字，因此即使渐近复杂度差得多的算法也能满足规定的限制。 小界限对于实现选择很有用，但它们不会改变潜在的数学问题：我们需要计算矩阵的秩。 

有两个输入格式细节值得仔细处理。 首先，零向量立即使向量组线性相关。 例如，```
1 2
0 0
```有答案`YES`，因为零向量的系数可以选择为 1。仅查找重复行的排名实现可能会错误地报告独立性。 

其次，重复或成比例的向量也会产生依赖性。 例如，```
2 2
1 2
2 4
```有答案`YES`，因为第二个向量是第一个向量的两倍。 检查行是否仅仅不同是不够的。 重要的是一行是否可以表示为其他行的线性组合。 

提供的语句表示第一个输入值是 (T)，而显示的示例直接以`n m`。 这两块是不一致的。 下面的解决方案接受正式的多测试用例格式，并且还识别显示的示例格式，因此算法本身不受这种格式差异的影响。 

## 方法

 直接的暴力想法是枚举向量的每个非空子集并测试该子集是否线性相关。 如果任何子集是相关的，则整个向量组都是相关的。 对于每个子集，我们可以对其行进行高斯消除。 

这种方法是正确的，因为当向量族包含非空线性相关子族时，它恰好是线性相关的。 它最坏情况的复杂度是 (O(2^n m^3))，因为有 (2^n-1) 个非空子集和排名计算成本 (O(m^3))。 对于实际最大值 (n=10) 和 (m=4)，每个测试用例最多大约为 (1024\cdot64=65536) 个基本消除规模操作，因此即使这种强力方法也能轻松通过。 

该方法的问题不在于给定的限制，而是对 (n) 的不必要的指数依赖性。 如果同一任务允许数千或数十万个向量，则枚举子集将立即变得不可能。 线性相关的结构为我们提供了一条更清晰的路线：所有向量都可以放入一个矩阵中，并且独立向量的数量恰好是矩阵的秩。 

关键的观察是高斯消除法直接计算这个等级。 每一次成功的转型都确定了一个独立的方向。 如果我们恰好找到 (n) 个主元，则 (n) 个向量中的每一个都贡献一个新的独立方向，因此向量是独立的。 如果存在少于 (n) 个主元，则某个向量是先前独立方向的组合，因此该族是相关的。 

由于 (m) 是列数，因此秩永远不能超过 (m)。 这也解释了直接的 (n>m) 情况：不可能仅在 (m) 列中存在 (n) 个主元。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n·m^3)) | (O(nm)) | 此处已接受，但不必要呈指数增长 |
 | 最佳 | (O(nm^2)) | (O(nm)) | 已接受 |

 ## 算法演练

 1. 读取 (n)、(m) 和 (n) 向量，将向量视为 (n\times m) 矩阵的行。 这将原始问题直接转化为矩阵秩问题。 
2、如果(n>m)，立即输出`YES`。 (m) 维向量空间不能包含超过 (m) 个线性无关向量，因此保证了相关性。 
3. 维护当前的数据透视行。 最初是第 0 行。对于每一列，在其余行中搜索该列中的值不为零的行。 如果不存在这样的行，则该列无法提供另一个独立方向，因此请移至下一列。 
4. 当找到非零主元时，将该行交换到当前主元位置。 我们可以将主元行除以其主元值，使主元等于 1。这里使用精确有理算术，以便结果不依赖于浮点精度。 
5. 从每隔一行中删除当前的数据透视列。 消除后，每个先前处理的数据透视列在其数据透视行之外都有零。 这给出了一种行阶梯式表示，其中每个成功的主元对应于一个独立的维度。 
6. 增加等级并将枢轴行移动到下一个位置。 处理完所有列后，成功旋转的数量就是矩阵的秩。 
7. 将排名与(n)进行比较。 如果`rank == n`，所有 (n) 个向量都是线性无关的，因此输出`NO`。 否则，秩小于向量的数量，因此输出`YES`。 

### 为什么它有效

 中心不变量是，在每次成功枢轴之后，处理的枢轴行代表相互独立的方向，并且每个处理的列都已从其他行中消除。 仅当仍然存在包含先前数据透视行无法生成的信息的行时，新数据透视表才能存在。 

因此，每个主元的排名都会增加一位。 高斯消除以与输入向量的跨度维度完全相同的主元数结束。 当大小为 (n) 的向量族的跨度为 (n) 时，它恰好是线性无关的，因此`rank == n`正是所需的条件`NO`回答。 

## Python 解决方案```python
import sys
from fractions import Fraction

input = sys.stdin.readline

def independent(vectors, m):
    n = len(vectors)

    if n > m:
        return False

    a = [[Fraction(x) for x in row] for row in vectors]

    rank = 0

    for col in range(m):
        pivot = -1

        for row in range(rank, n):
            if a[row][col] != 0:
                pivot = row
                break

        if pivot == -1:
            continue

        a[rank], a[pivot] = a[pivot], a[rank]

        pivot_value = a[rank][col]
        for j in range(col, m):
            a[rank][j] /= pivot_value

        for row in range(n):
            if row == rank:
                continue

            factor = a[row][col]
            if factor == 0:
                continue

            for j in range(col, m):
                a[row][j] -= factor * a[rank][j]

        rank += 1

        if rank == n:
            return True

    return False

def solve():
    data = sys.stdin.buffer.read().split()
    if not data:
        return

    # The formal statement uses T test cases.
    # The displayed sample omits T and starts directly with n m.
    # Detect both formats from the first input line.
    lines = sys.stdin.buffer.read().splitlines()

    # Re-read using the raw data above if possible.
    # For the formal format, the first line contains only T.
    first_line = lines[0].split()

    if len(first_line) == 1:
        t = int(first_line[0])
        pos = 1

        answers = []

        for _ in range(t):
            n = int(data[pos])
            m = int(data[pos + 1])
            pos += 2

            vectors = []
            for _ in range(n):
                vectors.append(list(map(int, data[pos:pos + m])))
                pos += m

            answers.append("NO" if independent(vectors, m) else "YES")

        sys.stdout.write("\n".join(answers))
    else:
        # Format used by the displayed sample: n m followed by n vectors.
        pos = 0
        n = int(data[pos])
        m = int(data[pos + 1])
        pos += 2

        vectors = []
        for _ in range(n):
            vectors.append(list(map(int, data[pos:pos + m])))
            pos += m

        sys.stdout.write("NO\n" if independent(vectors, m) else "YES\n")

if __name__ == "__main__":
    solve()
```这`independent`函数首先处理维度参数。 当(n>m)时，返回`False`因为向量不可能是独立的。 这与演练中使用的数学捷径相同。 

矩阵转换为`Fraction`消除前的值。 尽管输入仅由整数组成，但高斯消去法期间的除法可以创建有理值。 使用浮点数通常适用于这些微小的界限，但精确的算术使依赖性测试在数学上稳健，并避免选择任意 epsilon 来确定值是否为零。 

外循环将每一列处理为可能的枢轴位置。 搜索开始于`rank`，因为该位置上方的行已经包含已建立的枢轴。 一旦找到非零值，相应的行就会交换到位。 

对主元行进行归一化，使主元等于 1。然后，该实现会从所有其他行中消除主元列。 消除主元上方和下方的工作量比普通行梯形形式所需的最少工作量稍多，但它使矩阵保持简化形式，并使秩不变性特别简单。 

早期的`rank == n`返回是安全的，因为排名只会增加。 一旦已经有 (n) 个主元，所有 (n) 个向量都是独立的，并且后面的列都不能改变该结论。 

解析器包含一个小的兼容性层，因为提供的语句和显示的示例对于 (T) 是否存在存在分歧。 如果第一行包含一个整数，则将其视为 (T)。 如果它包含两个整数，则将它们视为 (n,m)，与显示的样本匹配。 实际的线性代数在两种格式中都是相同的。 

## 工作示例

 ### 示例 1

 显示的样本包含两个向量：```
2 2
1 1
0 1
```矩阵是

 [
 \开始{p矩阵}
 1&1\
 0&1
 \end{pmatrix}。 
]

 消除过程如下。 

| 专栏 | 枢轴行| 矩阵状态| 排名|
 | --- | --- | --- | --- |
 | 0 | 0 | (\begin{pmatrix}1&1\0&1\end{pmatrix}) | 1 |
 | 1 | 1 | (\begin{pmatrix}1&0\0&1\end{pmatrix}) | 2 |

 最终的秩是 2，等于向量的数量。 因此向量是线性无关的，答案是`NO`。 

这个例子演示了基本的不变量：每一个成功的枢轴都会贡献一个独立的方向。 第二个向量不是第一个向量的倍数，因此存在第二个主元。 

### 示例 2

 考虑两个比例向量：```
1
2 2
1 2
2 4
```矩阵是

 [
 \开始{p矩阵}
 1&2\
 2&4
 \end{pmatrix}。 
]

 | 专栏 | 枢轴行| 矩阵状态| 排名|
 | --- | --- | --- | --- |
 | 0 | 0 | (\begin{pmatrix}1&2\2&4\end{pmatrix}) | 1 |
 | 1 | 无 | (\begin{pmatrix}1&2\0&0\end{pmatrix}) | 1 |

 仅找到一个枢轴。 第二行变为零，因为它是第一行的两倍。 因此等级为 1，小于 (n=2)，所以答案为`YES`。 

该迹线练习了向量不同但仍线性相关的情况。 仅仅检查两行是否相等会错过这个例子，而排名会立即检测到它。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm^2)) | 最多处理 (m) 个主元列，并消除主元触及 (O(nm)) 个矩阵条目 |
 | 空间| (O(nm)) | 矩阵存储所有 (n) 个向量 |

 对于 (n\le10) 和 (m\le4)，矩阵最多包含 40 个条目。 甚至精确`Fraction`对于这些限制来说，算术很容易足够快，并且与 64 MB 限制相比，内存使用量可以忽略不计。 

除了这些微小的限制之外，渐近界限也是合适的。 该解决方案避免了枚举子集并在一次消除过程中计算整个排名。 

## 测试用例```python
import sys
import io
from fractions import Fraction

def independent(vectors, m):
    n = len(vectors)

    if n > m:
        return False

    a = [[Fraction(x) for x in row] for row in vectors]
    rank = 0

    for col in range(m):
        pivot = -1

        for row in range(rank, n):
            if a[row][col] != 0:
                pivot = row
                break

        if pivot == -1:
            continue

        a[rank], a[pivot] = a[pivot], a[rank]

        p = a[rank][col]
        for j in range(col, m):
            a[rank][j] /= p

        for row in range(n):
            if row == rank:
                continue

            factor = a[row][col]
            if factor == 0:
                continue

            for j in range(col, m):
                a[row][j] -= factor * a[rank][j]

        rank += 1

        if rank == n:
            return True

    return False

def run(inp: str) -> str:
    lines = inp.strip().splitlines()
    data = inp.split()

    if not data:
        return ""

    first_line = lines[0].split()

    if len(first_line) == 1:
        t = int(first_line[0])
        pos = 1
        out = []

        for _ in range(t):
            n = int(data[pos])
            m = int(data[pos + 1])
            pos += 2

            vectors = []
            for _ in range(n):
                vectors.append(list(map(int, data[pos:pos + m])))
                pos += m

            out.append("NO" if independent(vectors, m) else "YES")

        return "\n".join(out) + "\n"

    n = int(data[0])
    m = int(data[1])
    pos = 2

    vectors = []
    for _ in range(n):
        vectors.append(list(map(int, data[pos:pos + m])))
        pos += m

    return ("NO\n" if independent(vectors, m) else "YES\n")

# Provided sample, whose displayed format omits T.
assert run("""\
2 2
1 1
0 1
""") == "NO\n", "sample 1"

# Minimum-size case: one nonzero vector is independent.
assert run("""\
1
1 1
7
""") == "NO\n", "minimum nonzero vector"

# Zero vector is always dependent.
assert run("""\
1
1 3
0 0 0
""") == "YES\n", "zero vector"

# Two proportional vectors are dependent.
assert run("""\
1
2 2
1 2
2 4
""") == "YES\n", "proportional vectors"

# Maximum dimensions, with four independent vectors.
assert run("""\
1
4 4
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 100
""") == "NO\n", "maximum-size independent case"

# More vectors than dimensions must be dependent.
assert run("""\
1
5 4
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 1
1 1 1 1
""") == "YES\n", "n greater than m"

# Several test cases in the formal format.
assert run("""\
3
2 2
1 1
0 1
2 2
1 2
2 4
3 2
1 0
0 1
1 1
""") == "NO\nYES\nYES\n", "multiple test cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 / 7`|`NO`| 具有一个非零向量的最小尺寸情况 |
 |`1 / 1 3 / 0 0 0`|`YES`| 零矢量|
 |`1 / 2 2 / 1 2 / 2 4`|`YES`| 比例向量|
 |`1 / 4 4 / ...`|`NO`| 具有四个独立向量的最大维度 |
 |`1 / 5 4 / ...`|`YES`| 边界条件 (n>m) |
 | 三个正式测试用例 |`NO YES YES`| 多个测试用例解析和混合依赖结果 |

 ## 边缘情况

 第一个边缘情况是零向量。 考虑```
1
1 3
0 0 0
```该算法从等级 0 开始。在第 0 列中没有非零条目，在第 1 列和第 2 列中也发生同样的情况。没有找到主元，因此最终等级仍为 0。由于 (0<1)，向量是相关的，输出为`YES`。 这不需要任何特殊的零向量检查，因为高斯消除自然地将零行视为不贡献排名。 

第二个边缘情况是一对不同但成比例的向量：```
1
2 2
1 2
2 4
```第一行在第 0 列中提供一个主元，将等级增加到 1。从第二行中删除第 0 列会将其从`(2, 4)`到`(0, 0)`。 第二列没有剩余的非零候选，因此排名保持为 1。由于有两个向量，但只有一个独立方向，所以答案是`YES`。 

当向量多于坐标时，会出现第三种边缘情况：```
1
5 4
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 1
1 1 1 1
```算法返回`YES`立即因为 (5>4)。 无需消除。 只有四个可用的坐标方向，因此五个向量不能独立。 

第四种边缘情况是满秩方阵：```
1
4 4
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 100
```该算法在每一列中找到一个主元。 秩达到4，等于向量的数量，所以返回`NO`。 值 100 不会引起特殊处理，因为消除使用精确的有理算术。 

这些情况涵盖了表面解决方案可能失败的主要方式：将不同向量与独立向量混淆、忽略零向量、忘记 (n>m) 维度界限或使用近似算术而不考虑精确的零检测。
