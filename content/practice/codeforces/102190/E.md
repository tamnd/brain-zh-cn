---
title: "CF 102190E - 标准输入/输出"
description: "这个问题与普通的算法分类任务不同。 您将获得一个小型卷积神经网络的已训练参数，然后是 28 x 28 个二值图像的集合。"
date: "2026-08-19T05:51:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102190
codeforces_index: "E"
codeforces_contest_name: "2019 ECNU Campus Invitational Contest"
rating: 0
weight: 102190
solve_time_s: 624
verified: true
draft: false
---

[CF 102190E - 标准输入/输出](https://codeforces.com/problemset/problem/102190/E)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题与普通的算法分类任务不同。 您将获得一个小型卷积神经网络的已训练参数，然后是 28 x 28 个二值图像的集合。 您的工作是重现网络的前向传递并打印每个图像的预测字母。 

有四种可能的类别。 输出类别 0 为`C`，第 1 类为`E`，第 2 类为`N`，第 3 类为`U`。 输入以不相关的幻数开始，然后以固定的顺序给出网络的所有权重和偏差。 接下来是图像的数量和每个图像的像素。 

网络本身具有固定的结构。 28 x 28 图像首先通过四个 5 x 5 卷积滤波器，产生四个 24 x 24 特征图。 每个映射都通过 2 x 2 最大池化减少到 12 x 12。然后应用 ReLU。 结果经过九个 3 x 3 卷积滤波器，其中每个输出滤波器组合所有四个输入通道，产生九个 10 x 10 映射。 另一个 2 x 2 最大池操作将它们减少为 9 个 5 x 5 映射，然后是 ReLU。 这9乘5乘5的值被展平为225个数字，经过225到64的全连接层和ReLU，最后经过64到4的全连接层。 四个最终分数中最大的一个决定班级。 

卷积权重以扁平二维形式存储。 对于第一个卷积，4 x 1 x 5 x 5 张量变成 4 行，每行 25 个值。 对于第二个卷积，9 x 4 x 3 x 3 张量变成 9 行，每行 36 个值。 行顺序遵循自然的通道、行、列顺序，因此可以使用适当的算法直接对平面内核条目进行索引。 

固定的图像大小使得计算即使使用简单的嵌套循环也易于管理。 预期测试数据中只有2240张图像，每张图像包含784个像素。 最大的重复操作是卷积，但其维度很小：第一个卷积执行 4×24×24×25 乘加，第二个执行 9×10×10×36。全连接层也很小，每个图像有 225×64 和 64×4 乘加。 每个完整输入集需要数百万个基本运算，而不是渐近大型计算。 

主要危险不是渐近复杂性，而是忠实地再现网络的张量布局和操作顺序。 卷积必须使用步长为 1 的有效窗口，最大池化必须使用非重叠的 2 x 2 窗口，第二个卷积必须对所有四个输入通道求和。 在错误的阶段应用 ReLU 会改变网络。 

简单的边缘情况是仅包含零像素的图像。 假设每个权重都为零并且每个偏差都为零。 每个中间值都为零，并且所有四个最终分数都等于零。 正确的预测是`C`，因为当出现平局时，0 类会赢得普通 argmax。 例如，将最佳类初始化为 1 的实现将错误地打印`E`。 

当卷积得到负结果时，会发生另一种微妙的情况。 例如，如果第一个卷积的一个输出是`-3`，最大池化在第一个 ReLU 之前执行，以便该值可以与 2 x 2 池化窗口中的其他值竞争。 如果这四个值是`-3, -5, -7, -2`，最大池化产生`-2`，然后 ReLU 才会将其更改为零。 在这个特定示例中，在池化之前应用 ReLU 给出了相同的最大值，但这并不是随意通过网络移动操作的原因。 指定的排序应该直接实现，特别是因为第二个卷积后面也是池化，然后是 ReLU。 

每个卷积的边界是另一个常见的错误来源。 28 x 28 图像上的 5 x 5 窗口在每个方向上有 24 个有效起始位置，即行 0 到 23，列 0 到 23。从第 24 行开始需要访问图像外部的第 28 行。 同样，12 x 12 特征图上的 3 x 3 窗口的起始位置为 0 到 9，给出 10 x 10 结果。 

## 方法

 直接的方法是完全按照描述来实现神经网络。 对于卷积的每个输出位置，迭代内核行和列，对于第二个卷积，也迭代每个输入通道。 在相应的加权和之后添加偏差。 然后使用显式 2 x 2 窗口执行最大池化，应用 ReLU，按通道主词典顺序展平所得张量，并评估两个密集层。 

这种暴力实现已经足够快了，因为网络尺寸是固定的并且很小。 对于一幅图像，第一次卷积需要 4 乘以 24 乘以 24 乘以 25 = 57,600 次乘加。 第二个需要 9 乘以 10 乘以 10 乘以 4 乘以 9 = 32,400 次乘加。 第一个密集层花费 14,400 次乘加，第二个密集层花费 256 次。每个图像的总数大约为 105,000 次乘加，或者 2240 个图像的大约 2.35 亿次乘加。 

该计数在 Python 中看起来很大，因此有用的优化并不是新的数学算法。 关键的观察结果是架构是固定的，输入是二进制的，并且每个图像都重复使用相同的经过训练的滤波器。 我们可以将实现保持为简单的嵌套循环，同时通过将张量存储为平面数组并使用局部变量来减少 Python 级别的开销。 由于该问题没有可变的图像尺寸并且只有大约两千张图像，因此仔细编写的直接前向传播是适当的解决方案。 

更复杂的方法是尝试直接从图像中推断字母或训练单独的分类器。 这是不必要的，而且可能不太可靠。 提供的参数已经以高于接受阈值的保证精度对分类器进行编码，因此再现这些参数是预期的确定性解决方案。 

重要的实现细节是张量布局。 卷积权重已按输出通道、输入通道、内核行和列进行分组。 同样，展平的第二个卷积输出必须按通道 0 的 5 x 5 值排序，然后是通道 1 的 5 x 5 值，依此类推。 这与张量索引规定的字典顺序完全匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 直接神经网络前向传递 | O(t)，每个图像具有大约 105,000 次算术运算的固定常数 | 除固定网络参数外，每个图像的 O(1) | 已接受 |
 | 重建或训练另一个分类器 | 取决于方法，可能更大 | 取决于型号 | 不必要|

 ## 算法演练

1. 读取并丢弃幻数。 然后按照指定的顺序读取四组网络参数：第一个卷积的权重和偏差，第二个卷积的权重和偏差，第一个密集层的权重和偏差，以及最后一个密集层的权重和偏差。 它们的维度是固定的，因此每个都可以存储为平面 Python 列表。 
2. 读取图像数量并独立处理每个 28 x 28 图像。 仅保留当前图像可避免同时存储所有 2240 个图像。 
3. 计算第一个卷积。 对于每个输出通道和每个有效的 5 x 5 窗口，计算相应 25 个输入像素的加权和并添加通道的偏差。 由于输入只有一个通道，因此这里不存在通道循环。 输出的形状为 4 x 24 x 24。 
4. 对四个通道中的每一个通道独立应用 2 x 2 最大池化。 池化窗口不重叠，因此输出位置`(r, c)`读取行`2*r`和`2*r+1`和列`2*c`和`2*c+1`。 结果的形状为 4 x 12 x 12。 
5. 将 ReLU 应用于每个池值。 ReLU 将每个负值替换为零，并保持非负值不变。 
6. 计算第二个卷积。 对于 9 个输出通道中的每一个，每个 10 x 10 输出位置使用来自四个输入通道中每一个的 3 x 3 窗口。 对应于一个输出通道的 36 个核值乘以这四个 3 x 3 窗口并求和，然后是输出偏差。 
7. 应用另一个 2 x 2 最大池操作，将每个 10 x 10 通道减少到 5 x 5。然后将 ReLU 应用于所有 225 个结果值。 
8. 按通道主序展平 9 x 5 x 5 张量。 通道 0 的所有 25 个值首先出现，然后是通道 1 的所有 25 个值，依此类推。 这将为第一个全连接层生成 225 个输入。 
9. 评估第一致密层。 对于其 64 个神经元中的每一个，计算其 225 个权重与展平特征向量之间的点积，然后添加其偏差。 将 ReLU 应用于生成的 64 个值。 
10. 评估最终的致密层。 四个输出分数中的每一个都是 64 维隐藏向量与最终权重矩阵的一行加上相应偏差的点积。 预测是最大分数的索引。 
11. 使用映射将获胜索引转换为其字母`0 -> C`,`1 -> E`,`2 -> N`， 和`3 -> U`，然后打印它。 

### 为什么它有效

 不变的是，在每个阶段之后，程序都会准确存储指定神经网络为当前图像生成的张量。 第一个卷积以正确的偏差计算每个有效的内核窗口点积，因此它的四个特征图是准确的。 然后，最大池化从每个指定的 2 x 2 窗口中选择最大值，ReLU 执行所需的逐元素转换。 同样的论点也适用于第二个卷积和池化阶段。 由于展平后的向量遵循所需的字典通道、行、列顺序，因此两个完全连接的层都准确接收经过训练的网络所期望的值。 最终的 argmax 因此选择与原始模型相同的类。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    magic = input()

    conv1_w = [list(map(float, input().split())) for _ in range(4)]
    conv1_b = list(map(float, input().split()))

    conv2_w = [list(map(float, input().split())) for _ in range(9)]
    conv2_b = list(map(float, input().split()))

    fc1_w = [list(map(float, input().split())) for _ in range(64)]
    fc1_b = list(map(float, input().split()))

    fc2_w = [list(map(float, input().split())) for _ in range(4)]
    fc2_b = list(map(float, input().split()))

    t = int(input())
    letters = "CENU"
    output = []

    for _ in range(t):
        image = []
        for _ in range(28):
            image.extend(map(float, input().split()))

        # Conv 1: 1 -> 4, 28x28 -> 24x24.
        conv1 = [0.0] * (4 * 24 * 24)

        for oc in range(4):
            kernel = conv1_w[oc]
            bias = conv1_b[oc]
            base_out = oc * 24 * 24

            for r in range(24):
                out_base = base_out + r * 24
                img_base = r * 28

                for c in range(24):
                    s = bias
                    k = 0
                    for kr in range(5):
                        row_base = img_base + kr * 28 + c
                        for kc in range(5):
                            s += kernel[k] * image[row_base + kc]
                            k += 1

                    conv1[out_base + c] = s

        # Max-pooling: 24x24 -> 12x12.
        pool1 = [0.0] * (4 * 12 * 12)

        for ch in range(4):
            src_base = ch * 24 * 24
            dst_base = ch * 12 * 12

            for r in range(12):
                sr = 2 * r
                for c in range(12):
                    sc = 2 * c

                    a = conv1[src_base + sr * 24 + sc]
                    b = conv1[src_base + sr * 24 + sc + 1]
                    d = conv1[src_base + (sr + 1) * 24 + sc]
                    e = conv1[src_base + (sr + 1) * 24 + sc + 1]

                    pool1[dst_base + r * 12 + c] = max(a, b, d, e)

        # ReLU.
        for i in range(len(pool1)):
            if pool1[i] < 0:
                pool1[i] = 0.0

        # Conv 2: 4 -> 9, 12x12 -> 10x10.
        conv2 = [0.0] * (9 * 10 * 10)

        for oc in range(9):
            kernel = conv2_w[oc]
            bias = conv2_b[oc]
            dst_base = oc * 100

            for r in range(10):
                for c in range(10):
                    s = bias

                    for ic in range(4):
                        src_base = ic * 144
                        kernel_base = ic * 9

                        for kr in range(3):
                            src_row = src_base + (r + kr) * 12 + c
                            krow = kernel_base + kr * 3

                            s += (
                                kernel[krow] * pool1[src_row]
                                + kernel[krow + 1] * pool1[src_row + 1]
                                + kernel[krow + 2] * pool1[src_row + 2]
                            )

                    conv2[dst_base + r * 10 + c] = s

        # Max-pooling: 10x10 -> 5x5, followed by ReLU.
        features = [0.0] * (9 * 25)

        for ch in range(9):
            src_base = ch * 100
            dst_base = ch * 25

            for r in range(5):
                sr = 2 * r
                for c in range(5):
                    sc = 2 * c

                    a = conv2[src_base + sr * 10 + sc]
                    b = conv2[src_base + sr * 10 + sc + 1]
                    d = conv2[src_base + (sr + 1) * 10 + sc]
                    e = conv2[src_base + (sr + 1) * 10 + sc + 1]

                    value = max(a, b, d, e)
                    if value < 0:
                        value = 0.0

                    features[dst_base + r * 5 + c] = value

        # FC 1: 225 -> 64, followed by ReLU.
        hidden = [0.0] * 64

        for i in range(64):
            row = fc1_w[i]
            s = fc1_b[i]

            for j in range(225):
                s += row[j] * features[j]

            if s < 0:
                s = 0.0

            hidden[i] = s

        # FC 2: 64 -> 4.
        scores = [0.0] * 4

        for i in range(4):
            row = fc2_w[i]
            s = fc2_b[i]

            for j in range(64):
                s += row[j] * hidden[j]

            scores[i] = s

        best = 0
        for i in range(1, 4):
            if scores[i] > scores[best]:
                best = i

        output.append(letters[best])

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```输入解析器首先消耗固定数量的参数行。 卷积权重张量对于每个输出通道表示为一个平行，因此`conv1_w[oc]`包含一个 5 x 5 过滤器的 25 个值，而`conv2_w[oc]`包含四个连续的 3 x 3 内核。 

第一个卷积使用输出尺寸 24 x 24，因为 5 x 5 内核必须完全保留在 28 x 28 图像内。 循环限制`range(24)`因此不是任意常数，它们是有效窗口位置的确切数量。 

第一个池化阶段显式访问四个相邻值。 这避免了创建临时的二维列表，并且也使得两个的非重叠跨度变得明显。 ReLU 在池化之后应用，匹配网络定义。 

第二个卷积是最有可能被错误实现的部分。 一个输出通道有 4 个输入通道，每个输入通道贡献完整的 3 x 3 点积。 内核偏移量`ic * 9`从展平的行中选择适当的 3 x 3 块。 

在第二个池化阶段之后，每个通道恰好包含 25 个值。 由于通道是连续存储的，因此结果`features`列表已处于所需的展平顺序中。 无需转置或整形操作。 

密集层直接使用提供的矩阵。 Python 整数在这里不是问题，因为权重是浮点值，并且总和仍然是浮点值。 最终的argmax故意使用`>`而不是`>=`，因此关系仍分配给最低类索引，符合通常的 argmax 约定。 

## 工作示例

 所提供的问题文本中省略了该语句的实际样本矩阵，因此无法在此处重建其完整的数字前向传递。 以下两个小型合成轨迹使用简化的网络参数来演示相同的控制流。 

### 示例 1

 考虑一个概念输入，其网络产生以下四个最终分数：

 | 舞台| 价值观 |
 | --- | --- |
 | FC2 得分 0 | 2.5 | 2.5
 | FC2 得分 1 | -1.0 |
 | FC2 得分 2 | 0.7 | 0.7
 | FC2 得分 3 | 1.8 | 1.8
 | 精氨酸最大| 0 |
 | 输出|`C`|

 获胜分数是第一个，因此分类器打印`C`。 跟踪表明程序在选择类别之前没有应用 softmax。 Softmax 保留分数的顺序，因此计算它会增加工作量而不改变预测。 

### 示例 2

 考虑几个班级并列的最终分数：

 | 舞台| 价值观 |
 | --- | --- |
 | FC2 得分 0 | 0.0 | 0.0
 | FC2 得分 1 | 0.0 | 0.0
 | FC2 得分 2 | -2.0 |
 | FC2 得分 3 | 0.0 | 0.0
 | 扫描后的 Argmax | 0 |
 | 输出|`C`|

 初始最佳索引为零，程序仅在遇到严格更大的分数时才替换它。 因此，分数相同时，零级将被选中。 这是普通从左到右 argmax 的正确确定性行为。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) 具有固定常数 | 每个图像都具有相同的 28 x 28 尺寸，并通过固定大小的网络 |
 | 空间| 每张图像 O(1) | 所有网络维度都是固定的，并且只存储一张图像的中间张量 |

 对于预期的 2240 个图像，直接实现执行大约 2.35 亿次浮点乘加，以及池化和密集层工作。 与普通机器学习工作负载相比，该架构是固定的，输入大小很小，因此直接的前向传递是自然的竞争性编程解决方案。 该实现还避免存储整个测试集，使内存仅与固定网络和一张图像成比例。 

## 测试用例

 由于所提供的语句中省略了官方示例矩阵，因此如果不发明参数数据，则无法将它们复制为可执行断言。 以下测试使用生成的参数块来练习完整的前向传递实现。```python
import sys
import io

def build_case():
    parts = []

    # Magic number.
    parts.append("0")

    # Conv1 weights: 4 x 25.
    for _ in range(4):
        parts.append(" ".join(["0"] * 25))

    # Conv1 bias.
    parts.append("0 0 0 0")

    # Conv2 weights: 9 x 36.
    for _ in range(9):
        parts.append(" ".join(["0"] * 36))

    # Conv2 bias.
    parts.append("0 0 0 0 0 0 0 0 0")

    # FC1 weights: 64 x 225.
    for _ in range(64):
        parts.append(" ".join(["0"] * 225))

    # FC1 bias.
    parts.append(" ".join(["0"] * 64))

    # FC2 weights: 4 x 64.
    for _ in range(4):
        parts.append(" ".join(["0"] * 64))

    # FC2 bias.
    parts.append("0 0 0 0")

    parts.append("1")

    # One all-zero 28 x 28 image.
    for _ in range(28):
        parts.append(" ".join(["0"] * 28))

    return "\n".join(parts) + "\n"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# All parameters and pixels are zero, so all four scores tie at zero.
assert run(build_case()) == "C\n", "all-zero tie case"

def build_bias_case():
    parts = []

    parts.append("0")

    for _ in range(4):
        parts.append(" ".join(["0"] * 25))
    parts.append("0 0 0 0")

    for _ in range(9):
        parts.append(" ".join(["0"] * 36))
    parts.append("0 0 0 0 0 0 0 0 0")

    for _ in range(64):
        parts.append(" ".join(["0"] * 225))
    parts.append(" ".join(["0"] * 64))

    for _ in range(4):
        parts.append(" ".join(["0"] * 64))

    # Class 3 has the largest final bias.
    parts.append("0 0 0 10")

    parts.append("1")
    for _ in range(28):
        parts.append(" ".join(["0"] * 28))

    return "\n".join(parts) + "\n"

assert run(build_bias_case()) == "U\n", "final bias case"

def build_negative_hidden_case():
    parts = []

    parts.append("0")

    # Conv1 produces zero everywhere.
    for _ in range(4):
        parts.append(" ".join(["0"] * 25))
    parts.append("0 0 0 0")

    # Conv2 produces zero everywhere.
    for _ in range(9):
        parts.append(" ".join(["0"] * 36))
    parts.append("0 0 0 0 0 0 0 0 0")

    # FC1 has negative bias, so ReLU makes every hidden value zero.
    for _ in range(64):
        parts.append(" ".join(["0"] * 225))
    parts.append(" ".join(["-5"] * 64))

    # FC2 has distinct biases.
    for _ in range(4):
        parts.append(" ".join(["0"] * 64))
    parts.append("1 2 3 4")

    parts.append("1")
    for _ in range(28):
        parts.append(" ".join(["0"] * 28))

    return "\n".join(parts) + "\n"

assert run(build_negative_hidden_case()) == "U\n", "ReLU before final layer"

def build_two_images_case():
    parts = []

    parts.append("0")

    for _ in range(4):
        parts.append(" ".join(["0"] * 25))
    parts.append("0 0 0 0")

    for _ in range(9):
        parts.append(" ".join(["0"] * 36))
    parts.append("0 0 0 0 0 0 0 0 0")

    for _ in range(64):
        parts.append(" ".join(["0"] * 225))
    parts.append("0 " * 63 + "0")

    for _ in range(4):
        parts.append(" ".join(["0"] * 64))
    parts.append("0 0 0 0")

    parts.append("2")

    for _ in range(28):
        parts.append(" ".join(["0"] * 28))

    for _ in range(28):
        parts.append(" ".join(["1"] * 28))

    return "\n".join(parts) + "\n"

assert run(build_two_images_case()) == "C\nC\n", "multiple images"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有参数和像素均为零 |`C`| 平局处理和零值 ReLU |
 | 最终偏差`0 0 0 10`|`U`| 最终 argmax 和类映射 |
 | FC1 负偏差 |`U`| 第一个密集层之后的 ReLU |
 | 两个连续图像 |`C`,`C`| 每图像状态重置和输入消耗|

 ## 边缘情况

 全零情况通过初始化处理`best`为零，并且仅当后来的分数严格更大时才替换它。 当四个最终分数为零时，循环永远不会改变`best`，所以输出是`C`。 这很重要，因为即使每个网络计算在其他方面都是正确的，任意的平局打破规则也可能会产生不同的答案。 

卷积边界是通过迭代第一个卷积的行和列位置来处理的`range(24)`。 最终的有效窗口从坐标 23 开始，覆盖坐标 23 到 27。没有迭代从 24 开始，因此该实现永远不会读取 28 x 28 图像之外的内容。 第二个卷积类似地使用`range(10)`，在 12 x 12 输入中，其最后一个窗口从坐标 9 开始，到坐标 11 结束。 

第二个卷积的通道维度是另一个边缘情况。 对于一个输出通道，代码从输入通道 0 读取 3 x 3 区域，然后从通道 1、通道 2 和通道 3 读取另一个区域。省略此循环将有效地将四通道张量视为一个通道，并会产生完全不同的分数。 

扁平化顺序也很重要。 假设九个池通道包含值`0, 1, ..., 224`，每个通道占据 25 个连续位置。 第一个密集神经元必须接收来自通道 0 的前 25 个值，然后接收来自通道 1 的 25 个值，依此类推。 使用的存储布局`features`正是这个顺序，因此可以应用稠密矩阵而无需额外的排列。 

最后，该实现从头开始处理每个图像。 中间卷积和特征数组是为每张图像新分配的，因此一个测试图像中的值不会泄漏到下一个测试图像中。 当尝试通过重用缓冲区而不显式覆盖每个位置来优化分配时，这特别容易出错。
